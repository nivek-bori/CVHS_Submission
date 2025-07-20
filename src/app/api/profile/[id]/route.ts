import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
	// Request parameter verification
	const id = (await context.params).id;

	try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    return NextResponse.json({
      user: {
        ...user,
        createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
        updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : user.updatedAt,
      }
    }, { status: 200 });
	} catch (error: any) {
		console.log('Route: /api/route name error', error);

		return NextResponse.json({ user: null }, { status: 200 });
	}
}
