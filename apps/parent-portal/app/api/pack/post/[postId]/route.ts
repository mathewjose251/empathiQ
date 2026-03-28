import { NextResponse } from "next/server";

import { deleteOwnPackPost } from "../../../../_data/packData";

export function generateStaticParams() {
  return [];
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ postId: string }> },
) {
  const { postId } = await context.params;

  if (!postId) {
    return NextResponse.json({ error: "postId is required." }, { status: 400 });
  }

  const result = deleteOwnPackPost(postId);

  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}
