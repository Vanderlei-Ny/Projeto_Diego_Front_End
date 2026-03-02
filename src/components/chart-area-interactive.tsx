"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export const description = "An interactive area chart";

export type SchedulingChartPoint = {
  date: string;
  total: number;
};

type ChartAreaInteractiveProps = {
  data: SchedulingChartPoint[];
};

const chartConfig = {
  total: {
    label: "Agendamentos",
    color: "#B8952E",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const safeData = React.useMemo(
    () =>
      data
        .filter((item) => {
          const date = new Date(item.date);
          return !Number.isNaN(date.getTime());
        })
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        ),
    [data],
  );

  return (
    <Card className="@container/card bg-neutral-800 border-white/10 text-white">
      <CardHeader>
        <CardTitle className="text-[#B8952E]">
          Agendamentos por período
        </CardTitle>
        <CardDescription className="text-white/60">
          <span className="hidden @[540px]/card:block">
            Total diário de agendamentos
          </span>
          <span className="@[540px]/card:hidden">Visão por período</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {safeData.length === 0 ? (
          <div className="h-[250px] flex items-center justify-center text-white/60 border border-white/10 rounded-lg">
            Nenhum dado encontrado para o período selecionado.
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={safeData}>
              <defs>
                <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-total)"
                    stopOpacity={1.0}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-total)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("pt-BR", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                isAnimationActive={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("pt-BR", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="total"
                type="natural"
                fill="url(#fillTotal)"
                stroke="var(--color-total)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
