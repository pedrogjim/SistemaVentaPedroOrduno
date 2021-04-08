import { Component, OnInit,ViewChild } from '@angular/core';
import { ServiceService } from "../../servicios/service.service";
import {Observable} from 'rxjs';
import { MatSelect } from '@angular/material/select';
import {MatSnackBar,MatSnackBarHorizontalPosition,
      MatSnackBarVerticalPosition,} from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-capventasexp',
  templateUrl: './capventasexp.component.html',
  styleUrls: ['./capventasexp.component.css']
})

export class CapventasexpComponent implements OnInit {
  filteredOptions: Observable<string[]>;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
      private route: ActivatedRoute,
      private servicesService: ServiceService,
      private _snackBar: MatSnackBar
    ) { }
  @ViewChild('txtdistribuidora') someRef: MatSelect;
  //VARIABLES
  cInvoice = "";
  nPrecioUnitario = 0;
  nCodigoTipoDeVenta = "";
  dfecha = "";
  // this.route.paramMap.subscribe(params => {

  ngOnInit(): void {
    this.metodoProductor();
    this.metodoDistribuidora();
    this.metodoTipoDeVenta();
  }

// PARA OBTENER EL PRODUCTOR 
  resultado=null; 
  buscaSelect ={
    cCampos:null, cFrom:null, cWhere:null
  }
  cachaProductor={
    codigo:null,nomcorto:null
  }
  //
  //PARA OBTENER LA DISTRIBUIDORA
  resultadodistribuidora = null;  
  buscaSelectDistribuidora = {
    cCampos:null, cFrom:null, cWhere:null
  }
  cachaDistribuidora={
    codigo:null,nombre:null
  }
 //PARA OBTENER LA PRESENTACION
 resultapresentacion = null;  
 buscaSelectPresentacion = {
   cCampos:null, cFrom:null, cWhere:null
 }
 cachaPresentacion={
   codigo:null,nombre:null
 }
  //PARA OBTENER LOS MANIFIESTOS
  resultaManifiesto = null;  
  buscaSelectManifiesto = {
    cCampos:null, cFrom:null, cWhere:null
  }

  cachaManifiesto  = {
    completed:null,
    productor:null ,
    distribuidora:null,
    Presentacion:null,
    NomPresenta:null,
    NomEtiqueta:null,
    Bultos:null,
    preciounitario:null,
    Folio:null,
    IdPallet: null,
    IdManifiesto:null,
    IdVentaDet:null
};

 //PARA OBTENER EL TIPO DE VENTA
 resultatipodeventa = null;  
 buscaTipoDeVenta = {
   cCampos:null, cFrom:null, cWhere:null
 }
 cachaTipoDeVenta={
   codigo:null,nombre:null
 }

 validapantalla ():number{
  if (this.dfecha=="" || this.nCodigoProd=="" || this.nCodigoDist=="" || this.nCodigoMan==0) {
    this._snackBar.open('ES NECESARIO CAPTURAR LOS DATOS !!', 'Datos Incompletos', {
      duration: 2000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
    return 0;
  }else{
    return 1;
  }
 }
  establecercursor(evento){     
    var validar =this.validapantalla();
    if (validar == 1) {
      document.getElementById(evento).focus();    
      if(evento=='txtnompresentacion'){
        this.metodoPresentacion()
      }
  
      if(this.nCodigoProd=="" || this.nCodigoDist=="" || this.nCodigoMan==0){
        return;
        }else{
          if (evento=='txtinvoice') {
            this.metodoManifiesto() 
          }
        }
    }
      
   }

   nCodigoProd = "";
   metodoProductor(){
    this.buscaSelect.cCampos="codigo,nomcorto";
    this.buscaSelect.cFrom= "productor";
    this.buscaSelect.cWhere="";
    this.servicesService.selectQuery(this.buscaSelect).then(result=>this.resultado=result);
   }
   nCodigoDist = "";
   metodoDistribuidora(){
    this.buscaSelectDistribuidora.cCampos="codigo,nombre";
    this.buscaSelectDistribuidora.cFrom= "distribuidoras";
    this.buscaSelectDistribuidora.cWhere="";
    this.servicesService.selectQuery(
      this.buscaSelectDistribuidora).then(
        result => this.resultadodistribuidora = result);

   }
   varPresentacion = "";
   metodoPresentacion(){
    this.buscaSelectPresentacion.cCampos="codigo,nombre";
    this.buscaSelectPresentacion.cFrom= "presentacion";
    this.buscaSelectPresentacion.cWhere=" where codigo='"+this.varPresentacion+"'";
    console.log(this.buscaSelectPresentacion);
    this.servicesService.selectQuery(
      this.buscaSelectPresentacion).then(
        datos => {this.cachaPresentacion.nombre=datos['nombre']
        });
   }
// 
   nCodigoMan = 0;
   tablaGeneral: string[] = ['actions','Productor', 'Distribuidora','Folio','NomPresenta','NomEtiqueta','Bultos','PrecioUnitario'];
   metodoManifiesto(){
    this.buscaSelectManifiesto.cCampos="Pal.Productor,Man.Distribuidora,Pal.Folio,Eti.Nombre as NomEtiqueta,Pre.Nombre as NomPresenta,Pal.Presentacion,Pal.Etiqueta,Pal.Bultos,vDe.PrecioUnitario,Pal.id as IdPallet,Man.id as IdManifiesto,vDe.Id as IdVentaDet";
    this.buscaSelectManifiesto.cFrom= "Manifiestos man left outer join Pallets Pal on Man.id = Pal.Manifiesto left outer join Etiqueta Eti on Eti.Codigo = Pal.Etiqueta left outer join Presentacion Pre on Pre.Codigo = Pal.Presentacion left outer join ventasdetalle vDe on Pal.Id = vDe.idPallet";
    this.buscaSelectManifiesto.cWhere=" where Man.Productor='"+this.nCodigoProd+"' and Man.Distribuidora='"+this.nCodigoDist+"' and Man.Folio ="+this.nCodigoMan+" order by Pal.Etiqueta,Pal.Presentacion";
    console.log(this.buscaSelectManifiesto);
    this.servicesService.selectQuery(
      this.buscaSelectManifiesto).then(
        result => this.resultaManifiesto = result);
   }

   varTipodeVenta = "";
   metodoTipoDeVenta(){
    this.buscaTipoDeVenta.cCampos="codigo,nombre";
    this.buscaTipoDeVenta.cFrom= "tipodeventa";
    this.buscaTipoDeVenta.cWhere="";
    this.servicesService.selectQuery(
      this.buscaTipoDeVenta).then(
        result => this.resultatipodeventa = result);

   }

   //PARA GUARDAR
   guardaVentaDetalle = {
    fecha:null,invoice:null,salestype:null,idpallet:null,presentacion:null,
    bultos:null,idmanifiesto:null,preciounitario:null
  }
   GuardarVentaDetalle(){
    for(let cachaManifiesto of this.resultaManifiesto){
        if (cachaManifiesto.completed==true) {
             this.guardaVentaDetalle.fecha=this.dfecha;
             this.guardaVentaDetalle.invoice=this.cInvoice;
             this.guardaVentaDetalle.idpallet= cachaManifiesto.IdPallet;
             this.guardaVentaDetalle.idmanifiesto= cachaManifiesto.IdManifiesto;
             this.guardaVentaDetalle.presentacion=cachaManifiesto.Presentacion;
             this.guardaVentaDetalle.bultos = cachaManifiesto.Bultos;
             this.guardaVentaDetalle.salestype= this.nCodigoTipoDeVenta;
             this.guardaVentaDetalle.preciounitario = this.nPrecioUnitario;
             this.servicesService.insertVentaDetalle(this.guardaVentaDetalle).subscribe(
              (datos)=>{
                if (datos["varExito"]=='Ok') {
                  // alert (datos["msjExito"]);                  
                  this.metodoManifiesto();                  
                }
              }
             );             
        }
    }
  }

  EliminaVentaDetalle={
    Idventadet:null
  }
    EliminarVentaDetalle(){
    for(let cachaManifiesto of this.resultaManifiesto){
      if(cachaManifiesto.completed==true){
        this.EliminaVentaDetalle.Idventadet=cachaManifiesto.IdVentaDet;
        this.servicesService.eliminaVentaDetalle(this.EliminaVentaDetalle).subscribe(
          (datos)=>{
            if (datos["varExito"]=='Ok') {
              // alert (datos["msjExito"]);                  
              this.metodoManifiesto();                  
            }
          }
        );
      }
    }
  }

  allComplete: boolean = false;
  updateAllComplete() {
    
    this.allComplete = this.resultaManifiesto != null && this.resultaManifiesto.every(t => t.completed);
  }
  megyek: Observable<string[]>;
  someComplete(): boolean {
    
    if (this.resultaManifiesto == null) {
      return false;
    }
    return this.resultaManifiesto.filter(t => t.completed).length > 0 && !this.allComplete;
  }
  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.resultaManifiesto == null) {
      return;
    }
    this.resultaManifiesto.forEach(
      t => t.completed = completed
    );
    
  }
  
}


