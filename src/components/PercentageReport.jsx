import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ChartDataLabels);

const PercentageReport = ({ estado }) => {
  const [chartData, setChartData] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      console.log(`Buscando tarefas com estado: ${estado}`);
      const { data, error } = await supabase
        .from("tarefas")
        .select("*")
        .eq("estado", estado)
        .neq("descricao", "");
      if (error) {
        console.error("Erro ao buscar tarefas para relatório percentual:", error);
        return;
      }
      console.log("Dados buscados para relatório percentual:", data);
      const total = data.length;
      setTotalCount(total);

      // Agrupa as tarefas por descrição e conta quantas existem em cada grupo
      const counts = {};
      data.forEach(task => {
        const desc = task.descricao;
        counts[desc] = (counts[desc] || 0) + 1;
      });
      console.log("Contagem por tarefa:", counts);
      const labels = Object.keys(counts);
      const countsData = Object.values(counts);
      const percentages = countsData.map(count => ((count / total) * 100).toFixed(1));

      const config = {
        labels,
        datasets: [
          {
            label: "Quantidade",
            data: countsData,
            backgroundColor: "rgba(54, 162, 235, 0.6)"
          }
        ]
      };

      setChartData({ config, percentages });
    }
    fetchData();
  }, [estado]);

  const options = {
    indexAxis: 'y',
    plugins: {
      datalabels: {
        color: 'white',
        anchor: 'center',
        align: 'center',
        formatter: function (value, context) {
          if (chartData && chartData.percentages) {
            return chartData.percentages[context.dataIndex] + '%';
          }
          return '';
        }
      },
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed.x;
            const percentage = chartData ? chartData.percentages[context.dataIndex] : '';
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">
        Relatório Percentual para tarefas {estado === "Iniciado" ? "Iniciadas" : "Finalizadas"}
      </h3>
      <p className="mb-4">Total de tarefas analisadas: {totalCount}</p>
      {chartData ? (
        <Bar data={chartData.config} options={options} />
      ) : (
        <p>Carregando dados...</p>
      )}
    </div>
  );
};

export default PercentageReport;
