import { Button } from "@/components/base/ui/og/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/base/ui/og/card";
import { Item, ItemContent, ItemDescription } from "@/components/base/ui/og/item";

const chartData = [
  { month: "Dec", amount: 800 },
  { month: "Jan", amount: 1100 },
  { month: "Feb", amount: 900 },
  { month: "Mar", amount: 1300 },
  { month: "Apr", amount: 750 },
  { month: "May", amount: 1400 },
];

const CHART_H = 160;

function BarChart() {
  const max = Math.max(...chartData.map((d) => d.amount));
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          height: CHART_H,
          width: "100%",
        }}
      >
        {chartData.map((d) => {
          const h = (d.amount / max) * CHART_H;
          return (
            <div
              key={d.month}
              style={{
                display: "flex",
                width: 40,
                height: h,
                borderRadius: 6,
                backgroundColor: "var(--chart-2)",
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 8,
          width: "100%",
        }}
      >
        {chartData.map((d) => (
          <div
            key={`l-${d.month}`}
            style={{
              display: "flex",
              width: 40,
              justifyContent: "center",
              fontSize: 12,
              color: "var(--muted-foreground)",
            }}
          >
            {d.month}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ContributionHistory() {
  return (
    <Card style={{ flex: 1 }}>
      <CardHeader>
        <CardTitle>Contribution History</CardTitle>
        <CardDescription>Last 6 months of activity</CardDescription>
      </CardHeader>
      <CardContent style={{ padding: "16px 24px 0 24px" }}>
        <BarChart />
      </CardContent>
      <CardContent style={{ padding: "12px 24px 16px 24px" }}>
        <div style={{ display: "flex", gap: 12 }}>
          <Item variant="muted" style={{ flex: 1 }}>
            <ItemContent>
              <ItemDescription>Upcoming</ItemDescription>
              <div
                style={{
                  display: "flex",
                  fontFamily: "var(--font-heading)",
                  fontSize: 17,
                  fontWeight: 600,
                  color: "var(--foreground)",
                }}
              >
                May 25, 2024
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 13,
                  color: "var(--muted-foreground)",
                }}
              >
                $1,000 scheduled
              </div>
            </ItemContent>
          </Item>
          <Item variant="muted" style={{ flex: 1 }}>
            <ItemContent>
              <ItemDescription>Auto-Save Plan</ItemDescription>
              <div
                style={{
                  display: "flex",
                  fontFamily: "var(--font-heading)",
                  fontSize: 17,
                  fontWeight: 600,
                  color: "var(--foreground)",
                }}
              >
                Accelerated
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 13,
                  color: "var(--muted-foreground)",
                }}
              >
                Recurring weekly
              </div>
            </ItemContent>
          </Item>
        </div>
      </CardContent>
      <CardFooter>
        <Button style={{ width: "100%" }}>View Full Report</Button>
      </CardFooter>
    </Card>
  );
}
