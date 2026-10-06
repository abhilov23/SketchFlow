import { SketchEditor } from "@/components/SketchEditor"

export default async function CanvasPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params
  return <SketchEditor boardId={roomId} />
}
