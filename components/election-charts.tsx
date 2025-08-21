"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Election } from "@/lib/store"
import { Doughnut, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  type ChartOptions,
} from "chart.js"

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

interface ElectionChartsProps {
  election: Election
}

export function ElectionCharts({ election }: ElectionChartsProps) {
  // Generate random colors for the charts
  const generateColors = (count: number) => {
    const colors = []
    for (let i = 0; i < count; i++) {
      const hue = (i * 137) % 360 // Use golden angle approximation for even distribution
      colors.push(`hsl(${hue}, 70%, 60%)`)
    }
    return colors
  }

  const backgroundColors = generateColors(election.candidates.length)
  const borderColors = backgroundColors.map((color) => color.replace("60%", "50%"))

  // Prepare data for the doughnut chart
  const doughnutData = {
    labels: election.candidates.map((c) => c.name),
    datasets: [
      {
        data: election.candidates.map((c) => c.votes),
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  }

  // Prepare data for the bar chart
  const barData = {
    labels: election.candidates.map((c) => c.name),
    datasets: [
      {
        label: "Votes",
        data: election.candidates.map((c) => c.votes),
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  }

  const barOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Vote Distribution",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  const doughnutOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Vote Share",
      },
    },
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Vote Distribution</CardTitle>
          <CardDescription>Votes received by each candidate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] md:h-[300px] flex items-center justify-center">
            <Bar data={barData} options={barOptions} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Vote Share</CardTitle>
          <CardDescription>Percentage of total votes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] md:h-[300px] flex items-center justify-center">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
