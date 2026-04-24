import { Button } from "@/components/base/ui/og/button";
import { Card, CardContent } from "@/components/base/ui/og/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/base/ui/og/empty";
import { IconPlaceholder } from "@/components/base/ui/og/icon-placeholder";

export function EmptyDistributeTrack() {
  return (
    <Card style={{ flex: 1 }}>
      <CardContent style={{ flex: 1, padding: 16 }}>
        <Empty>
          <EmptyMedia variant="icon">
            <IconPlaceholder size={24} />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Distribute Track</EmptyTitle>
            <EmptyDescription>
              Upload your first master to start reaching listeners on Spotify,
              Apple Music, and more.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>Create Release</Button>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  );
}
