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
function chart_generator(data: number[][], indices: string[]): ApexCharts | null {
	if (!indices || indices.length === 0) {
		return null;
	}
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

let charts: ApexCharts[] = []
for (let group_idx = 0; group_idx < selected.length; group_idx++) {

	const group_channels = selected[group_idx];

	if (!group_channels || group_channels.length === 0) continue;

	const group_data: number[][] = await Promise.all(
		group_channels.map(async (channel) => {
			const data: number[] | null = await invoke("get_data", { channel });
			return data ?? [];
		})
	);

	const chart = chart_generator(group_data, group_channels);
	if (chart) {
		charts.push(chart)
	}
}

if (charts.length > 0) {
	charts[0].resetSeries()
}