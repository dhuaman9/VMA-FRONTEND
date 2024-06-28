import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

  basicData: any;
  
  constructor(
    public route : ActivatedRoute,
  ) { }

  ngOnInit(): void {
  }

}
