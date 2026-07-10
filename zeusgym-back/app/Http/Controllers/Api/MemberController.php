<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Member;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MemberController extends Controller
{
    public function index(): JsonResponse
    {
        $members = Member::with(['sede', 'plan'])->get();

        return response()->json($members);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'apellido' => ['required', 'string', 'max:255'],
            'celular' => ['required', 'string', 'max:20'],
            'email' => ['required', 'email', 'max:255', 'unique:members,email'],
            'sede_id' => ['required', 'integer', 'exists:sedes,id'],
            'plan_id' => ['required', 'integer', 'exists:planes,id'],
        ]);

        $member = Member::create($validated);

        return response()->json($member->load(['sede', 'plan']), 201);
    }

    public function show(Member $member): JsonResponse
    {
        return response()->json($member->load(['sede', 'plan']));
    }

    public function update(Request $request, Member $member): JsonResponse
    {
        $validated = $request->validate([
            'nombre' => ['sometimes', 'required', 'string', 'max:255'],
            'apellido' => ['sometimes', 'required', 'string', 'max:255'],
            'celular' => ['sometimes', 'required', 'string', 'max:20'],
            'email' => [
                'sometimes',
                'required',
                'email',
                'max:255',
                Rule::unique('members', 'email')->ignore($member->id),
            ],
            'sede_id' => ['sometimes', 'required', 'integer', 'exists:sedes,id'],
            'plan_id' => ['sometimes', 'required', 'integer', 'exists:planes,id'],
        ]);

        $member->update($validated);

        return response()->json($member->load(['sede', 'plan']));
    }

    public function destroy(Member $member): JsonResponse
    {
        $member->delete();

        return response()->json(null, 204);
    }
}
