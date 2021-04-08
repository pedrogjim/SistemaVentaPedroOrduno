import { Injectable, OnInit, } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from '../../common/global-constants';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class ServiceService{
  isAuthenticated = false;
  constructor(
    private http:HttpClient ,private router: Router  
    ) {
      
     }
     ngOnInit(): void {  }
     authenticate(param): boolean {
      if (this.validarLogIn(param)) {
        this.isAuthenticated = true;
        this.router.navigate(['inicio']);
        return true;
      }
      this.isAuthenticated = false;
      return false;
    }

    selectQuery(jSonConsulta){
      var URL=GlobalConstants.apiURL
      //console.log(URL);
     // console.log( JSON.stringify(jSonConsulta));      
      return this.http.post(`${URL}ejecutaquery.php`, JSON.stringify(jSonConsulta)).toPromise(); 
    }

    ejecutaStoreProc(jSonConsulta){
      var URL=GlobalConstants.apiURL
      //console.log(URL);
     // console.log( JSON.stringify(jSonConsulta));      
      return this.http.post(`${URL}ejecutaStoreProc.php`, JSON.stringify(jSonConsulta)); 
    }

    insertVentaDetalle(jSonConsulta){
      var URL=GlobalConstants.apiURL
      //console.log(URL);
      //console.log(JSON.stringify(jSonConsulta));
      return this.http.post(`${URL}guardaventasexportacion.php`,JSON.stringify(jSonConsulta));
    }

    eliminaVentaDetalle(jSonConsulta){
      var URL=GlobalConstants.apiURL
      //console.log(URL);
      //console.log(JSON.stringify(jSonConsulta));
      return this.http.post(`${URL}eliminarventasexportacion.php`,JSON.stringify(jSonConsulta))
    }

    guardaVentaNacional(jSonConsulta){
      var URL=GlobalConstants.apiURL
     // console.log(URL);
    //  console.log(JSON.stringify(jSonConsulta));
      return this.http.post(`${URL}guardaVentaNacional.php`,JSON.stringify(jSonConsulta))
    }
    eliminaVentaDetalleNacional(jSonConsulta){
      var URL=GlobalConstants.apiURL
      //console.log(URL);
     // console.log("jSonParaEliminar"+JSON.stringify(jSonConsulta));
      return this.http.post(`${URL}eliminarventasnacional.php`,JSON.stringify(jSonConsulta))
    }
    validarLogIn(jSonConsulta){
      var URL=GlobalConstants.apiURL
      //console.log(URL);
    //  console.log(JSON.stringify(jSonConsulta));
      return this.http.post(`${URL}login.php`,JSON.stringify(jSonConsulta))      
    }
    repEdoCtaCliente(jSonConsulta){
      var URL=GlobalConstants.apiURL
      console.log(URL);
      // console.log("jSonParaEliminar"+JSON.stringify(jSonConsulta));
       return this.http.post(`${URL}repEdoCtaCliente.php`,JSON.stringify(jSonConsulta))
     }

     StoreReportes(jSonConsulta,cProductor){
       console.log(JSON.stringify(jSonConsulta));       
       var URLReporte = ""
       if(cProductor=='01'){
          var URLReporte="http://192.168.10.201/apiventas/"
       }else{
          var URLReporte="http://192.168.11.200/apiventas/"
       }      
      //console.log( JSON.stringify(jSonConsulta));      
      return this.http.post(`${URLReporte}ejecutaStoreProc.php`, JSON.stringify(jSonConsulta)).toPromise(); 
    }
    selectParaReportes(jSonConsulta,cProductor){
      var URLReporte="";
      console.log(JSON.stringify(jSonConsulta));
      
      if(cProductor=='01'){
        console.log("Entro URL Chaparral");        
        var URLReporte="http://192.168.10.201/apiventas/";
     }else{
        var URLReporte="http://192.168.11.200/apiventas/";
     }      
      return this.http.post(`${URLReporte}ejecutaquery.php`, JSON.stringify(jSonConsulta)).toPromise(); 
    }
    logout() {
      this.isAuthenticated = false;
      this.router.navigate(['']);
    }
    pdf(cParaMId,cTitulo,cSubtitulo){
      var divContents = document.getElementById(cParaMId).innerHTML; 
      let originalContent = document.body.innerHTML;
      var a = window.open('','_blank', 'top=0,left=0,height=100%, width=auto'); 
      // var fecha = new Date();
      // var imagen = "../assets/logoGrupoChaparral"
      // var options = { day: 'numeric',month: 'long', year: 'numeric' };
        a.document.write(`
          <html>
            <head>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" 
            integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2"
            crossorigin="anonymous">
              <style>
                html, body { height: 100%; }
                body { margin: 0; font-family: Roboto, "Helvetica Neue", sans-serif; }
                  table {
                    width: 100%;
                  }
                  .table td, 
                  .table th {
                    border-top: 1px solid #dee2e6;
                  }
              </style>
            </head>
            <body onload="window.print();window.close()">
            <div class="row">
              <h3 style="text-align: center;">
               <img src="../assets/logoGrupoChaparral.png" width="25%">
               <b>${cTitulo}</b>
              </h3>
            </div>
            <h5 style="text-align: center;">
              ${cSubtitulo}
            </h5>          
            ${divContents}
            </body>
          </html>`);  
        a.document.close(); 
    }    
}

