import { Component, OnInit } from '@angular/core';
import { ServiceService } from "../../servicios/service.service";
import {Observable} from 'rxjs';
import { FormBuilder, Validators,FormGroup, FormControl } from '@angular/forms';
import {startWith, map} from 'rxjs/operators';

export interface EmployeeProd  {
  codigo:string;
  nomcorto:string;
}
export interface InterDistribuidora  {
  codigo:string;
  nomcorto:string;
}

@Component({
  selector: 'app-cappedidos',
  templateUrl: './cappedidos.component.html',
  styleUrls: ['./cappedidos.component.css']
})
export class CappedidosComponent implements OnInit {
 
  //PARA FILTRAR PRODUCTOR
  productorCtrl = new FormControl();
  filteredEmployeeProd: Observable<EmployeeProd[]>;
  employeesProd: EmployeeProd[] = [];

  //PARA FILTRAR DISTRIBUIDORA
  distribuidoraCtrl = new FormControl();
  filtroDistribuidora: Observable<InterDistribuidora[]>;
  arrayDistribuidora: InterDistribuidora[] = [];

  constructor(private servicesService: ServiceService) { }

  ngOnInit(): void {
    this.metodoProductor();
    this.metodoDistribuidora();
  }
  datoscaptura={
    productor:'',
    fecha:'',
    distribuidora:'',
    cantidad:null
    
  }
// OBTENER PRODUCTOR//////
  nCodigoProd="";
  resultado=null; 
  buscaSelect ={
    cCampos:null, cFrom:null, cWhere:null
  }
  cachaProductor={
    codigo:null,nomcorto:null
  }  
  metodoProductor(){
    this.buscaSelect.cCampos="codigo,TRIM(nomcorto) AS nomcorto";
    this.buscaSelect.cFrom= "productor";
    this.buscaSelect.cWhere="";
    this.servicesService.selectQuery(this.buscaSelect).then(result=>this.resultado=result);
    this.employeesProd=this.resultado;
      this.filteredEmployeeProd = this.productorCtrl.valueChanges
      .pipe(
        startWith(''),
        map(productor => productor ? this._filterEmployeesprod(productor) : this.employeesProd.slice())
      );
   }

  //  OBTENER DISTRIBUIDORA
  resultDistribuidora=null;
  buscaDistribuidora = {
    cCampos:null, cFrom:null, cWhere:null
  }
  cachaDistribuidora ={
    codigo:null,nomcorto:null
  }
  metodoDistribuidora(){
    this.buscaDistribuidora.cCampos = "codigo,trim(nomcorto) as nomcorto";
    this.buscaDistribuidora.cFrom = "distribuidoras";
    this.buscaDistribuidora.cWhere= "";
    this.servicesService.selectQuery(this.buscaDistribuidora).then(result=>this.resultDistribuidora=result);
    this.arrayDistribuidora=this.resultDistribuidora;
    this.filtroDistribuidora = this.distribuidoraCtrl.valueChanges
      .pipe(
        startWith(''),
        map(distribuidora => distribuidora ? this._filtroDisribuidora(distribuidora) : this.arrayDistribuidora.slice())
      );
  }
  destinos: string[] = [
    'Nogales', 'McAllen'
  ];

   private _filterEmployeesprod(value: string): EmployeeProd[] {
    const filterValue = value.toLowerCase();
    return this.employeesProd.filter(state => state.nomcorto.toLowerCase().indexOf(filterValue) === 0);
  }
  private _filtroDisribuidora(value: string): InterDistribuidora[] {
    const filterValue = value.toLowerCase();
    return this.arrayDistribuidora.filter(state => state.nomcorto.toLowerCase().indexOf(filterValue) === 0);
  }
}
