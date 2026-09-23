import {
  assessWriting,
  AssessmentInputError,
  assessmentRequestSchema,
} from "@/lib/typesafe-assessment";
import { ZodError } from "zod";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: "許可されていないリクエストです。" }, { status: 403 });
  }

  const apiKey = process.env.TYPESAFE_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "AI参考バンドが設定されていません。" },
      { status: 503 },
    );
  }

  try {
    const payload: unknown = await request.json();
    const input = assessmentRequestSchema.parse(payload);
    const assessment = await assessWriting(apiKey, input);
    return Response.json(assessment, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (
      error instanceof ZodError ||
      error instanceof SyntaxError ||
      error instanceof AssessmentInputError
    ) {
      return Response.json(
        { error: "答案データの形式が正しくありません。" },
        { status: 400 },
      );
    }

    console.error("Writing assessment failed", error);
    return Response.json(
      { error: "参考バンドを算出できませんでした。時間を置いて再試行してください。" },
      { status: 502 },
    );
  }
}
