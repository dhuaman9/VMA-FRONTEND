import {BarChartBasicoDto} from "./bar-chart-basico-dto";
import {CostoTotalConcurridoDto} from "./costo-total-concurrido";

export class CostoTotalIncurridoCompletoDTO {
  barChartData: BarChartBasicoDto[];
  costoAnualIncurridoList: CostoTotalConcurridoDto[];
}