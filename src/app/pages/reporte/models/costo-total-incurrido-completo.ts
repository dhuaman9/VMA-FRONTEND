import {BarChartBasicoDto} from "./bar-chart-basico-dto";
import {CostoTotalConcurridoDto} from "src/app/pages/reporte/models/costo-total-concurrido";

export class CostoTotalIncurridoCompletoDTO {
  barChartData: BarChartBasicoDto[];
  costoAnualIncurridoList: CostoTotalConcurridoDto[];
}