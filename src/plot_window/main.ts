import { invoke } from '@tauri-apps/api/core';
import ApexCharts from 'apexcharts'

const index: string[] = await invoke("get_index", {})
const selected: string[][] = await invoke("get_selected", {});

const baseOptions = {
	chart: {
		type: "line",
		height: "100%",
		toolbar: { show: true },
		group: "synced-charts",
	},
	stroke: {
		width: 3,
	},
	colors: [
		"#F28482", // coral
		"#F6BD60", // sand
		"#84A59D", // teal
		"#90BE6D", // green
		"#B56576", // rose
		"#6D597A", // plum
		"#E07A5F", // terracotta
		"#3D5A80", // blue
		"#98C1D9", // sky
		"#5C7AEA", // indigo
		"#CDB4DB", // lavender
		"#FFAFCC", // pink
		"#F4978E", // salmon
		"#588157", // forest
		"#BC6C25", // amber
		"#8E9AAF", // blue-gray
		"#6C757D", // slate
		"#E76F51"  // orange
	],
	legend: {
		position: "top",
	},
	xaxis: {
		index
	},
	tooltip: {
		enabled: false
	}
};

let chart_counter = 0
function chart_generator(data: number[][], indices: string[]): ApexCharts {
	const chartContainer = document.createElement("div")
	chartContainer.className = "chart-container"

	const chartBox = document.createElement("div")
	chartBox.className = "chart-box"
	chartBox.id = `chart${chart_counter}`

	chartContainer.appendChild(chartBox)
	document.body.appendChild(chartContainer)

	let series = [];
	for (let i = 0; i < indices.length; i++) {
		series.push({
			name: indices[i],
			data: data[i]
		});
	}

	const chart = new ApexCharts(document.querySelector(`#chart${chart_counter}`), {
		...baseOptions,
		chart: {
			...baseOptions.chart,
			id: `chart${chart_counter}`
		},
		series: series,
	});

	chart_counter++
	chart.render()
	return chart
}

chart_generator(
	[[10, 41, 35, 51, 49, 62, 69], [23, 12, 54, 61, 32, 56, 81], [5, 15, 25, 35, 45, 55, 65]],
	["Sales", "Revenue", "Growth"]
)
