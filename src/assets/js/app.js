const languageTable = {
  "decimal": "",
  "emptyTable": "No hay información",
  "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
  "infoEmpty": "Mostrando 0 to 0 of 0 registros",
  "infoFiltered": "(Filtrado de _MAX_ total registros)",
  "infoPostFix": "",
  "lengthMenu": "Mostrar _MENU_ registros",
  "loadingRecords": "Cargando...",
  "processing": "Procesando...",
  "search": "Buscar:",
  "zeroRecords": "Sin resultados encontrados",
  "paginate": {
      "first": "Primero",
      "last": "Último",
      "next": "Siguiente",
      "previous": "Anterior"
  }
}

function attachEventsToTabInRepVarOperacional(){    

  setTimeout(()=>{  
    
    $('#tab-conexiones').on('shown.bs.tab', function (e) {
        
        if ( $.fn.dataTable.isDataTable( '#table-sector-conexiones' ) ) {
            setTimeout(()=>{  
              var table = $('#table-sector-conexiones').DataTable(); console.log('redimensiona'); table.columns.adjust().draw();
            }, 200);
          }
    });

    $('#tab-variables').on('shown.bs.tab', function (e) {
        
        if ( $.fn.dataTable.isDataTable( '#table-sector-variables' ) ) {
            setTimeout(()=>{  
              var table = $('#table-sector-variables').DataTable(); console.log('redimensiona'); table.columns.adjust().draw();
            }, 200);
          }
    });

  }, 600);
}

function attachEventsToTabInRepParamCalidad(){
  
  setTimeout(()=>{  
    
    $('a[href="#total"]').on('shown.bs.tab', function (e) {
      
      if ( $.fn.dataTable.isDataTable( '#table-total' ) ) {
          setTimeout(()=>{  
            var table = $('#table-total').DataTable(); console.log('redimensiona tab-total'); table.columns.adjust().draw();
          }, 200);
      }
    });

    $('#tab-satisfactorio').on('shown.bs.tab', function (e) {

      if ( $.fn.dataTable.isDataTable( '#table-satisfactorio' ) ) {
          setTimeout(()=>{  
            var table = $('#table-satisfactorio').DataTable(); console.log('redimensiona tab-satisfactorio'); table.columns.adjust().draw();
          }, 200);
      }
    });

  }, 600);
}

function attachEventsToPushMenu(){
  
  if ( $.fn.dataTable.isDataTable( '#table-trimestral' ) ) {
    setTimeout(()=>{  
      var table = $('#table-trimestral').DataTable(); console.log('redimensiona'); table.columns.adjust().draw();
    }, 200);
  }

  if ( $.fn.dataTable.isDataTable( '#table-mensual' ) ) {
    setTimeout(()=>{  
      var table = $('#table-mensual').DataTable(); console.log('redimensiona'); table.columns.adjust().draw();
    }, 200);
  }

  if ( $.fn.dataTable.isDataTable( '#table-localidad-presion' ) ) {
    setTimeout(()=>{  
      var table = $('#table-localidad-presion').DataTable(); console.log('redimensiona'); table.columns.adjust().draw();
    }, 200);
  }

  if ( $.fn.dataTable.isDataTable( '#table-localidad-continuidad' ) ) {
    setTimeout(()=>{  
      var table = $('#table-localidad-continuidad').DataTable(); console.log('redimensiona'); table.columns.adjust().draw();
    }, 200);
  }

  if ( $.fn.dataTable.isDataTable( '#table-sector-conexiones' ) ) {
    setTimeout(()=>{  
      var table = $('#table-sector-conexiones').DataTable(); console.log('redimensiona'); table.columns.adjust().draw();
    }, 200);
  }

  if ( $.fn.dataTable.isDataTable( '#table-sector-variables' ) ) {
    setTimeout(()=>{  
      var table = $('#table-sector-variables').DataTable(); console.log('redimensiona'); table.columns.adjust().draw();
    }, 200);
  }

  if ( $.fn.dataTable.isDataTable( '#table-total' ) ) {
    setTimeout(()=>{  
      var table = $('#table-total').DataTable(); console.log('redimensiona'); table.columns.adjust().draw();
    }, 200);
  }

  if ( $.fn.dataTable.isDataTable( '#table-satisfactorio' ) ) {
    setTimeout(()=>{  
      var table = $('#table-satisfactorio').DataTable(); console.log('redimensiona'); table.columns.adjust().draw();
    }, 200);
  }
}

function clearAllTableRepVarGestion(){

  if ( $.fn.dataTable.isDataTable( '#table-mensual' ) ) {
    $('#table-mensual').DataTable().destroy();
  }

  if ( $.fn.dataTable.isDataTable( '#table-trimestral' ) ) {
    $('#table-trimestral').DataTable().destroy();
  }

}

function clearAllTableRepVarOperacional(){
  if ( $.fn.dataTable.isDataTable( '#table-localidad-presion' ) ) {
    $('#table-localidad-presion').DataTable().destroy();
  }

  if ( $.fn.dataTable.isDataTable( '#table-localidad-continuidad' ) ) {
    $('#table-localidad-continuidad').DataTable().destroy();
  }

  if ( $.fn.dataTable.isDataTable( '#table-sector-conexiones' ) ) {
    $('#table-sector-conexiones').DataTable().destroy();
  }

  if ( $.fn.dataTable.isDataTable( '#table-sector-variables' ) ) {
    $('#table-sector-variables').DataTable().destroy();
  }
}

function clearAllTableRepParamCalidad(){

  if ( $.fn.dataTable.isDataTable( '#table-total' ) ) {
    $('#table-total').DataTable().destroy();
  }

  if ( $.fn.dataTable.isDataTable( '#table-satisfactorio' ) ) {
    $('#table-satisfactorio').DataTable().destroy();
  }

}

function createTableMensual(){
  
  setTimeout(()=>{  
    $('#table-mensual').DataTable( {
          retrieve: true,
          pagingType: 'full_numbers',
          pageLength: 10,
          processing: true,
          lengthMenu : [10, 50, 100],
          scrollX: true,
          scrollCollapse: true,
          "columnDefs": [
            {"targets": "_all", "className": "datatable-font-size-01 dt-center"}
          ],
          language : languageTable
    } );
  }, 750);
}

function createTableTrimestral(){
 
  setTimeout(()=>{  
    $('#table-trimestral').DataTable( {
          retrieve: true,
          pagingType: 'full_numbers',
          pageLength: 10,
          processing: true,
          lengthMenu : [10, 50, 100],
          scrollX: true,
          scrollCollapse: true,
          "columnDefs": [
            {"targets": "_all", "className": "datatable-font-size-01 dt-center"}
          ],
          language : languageTable
    } );
  }, 500);
}

function createTableLocalidadPresion(){
  
  setTimeout(()=>{  
    $('#table-localidad-presion').DataTable( {
          retrieve: true,
          pagingType: 'full_numbers',
          pageLength: 10,
          processing: true,
          lengthMenu : [10, 50, 100],
          scrollX: true,
          "columnDefs": [
            {"targets": "_all", "className": "datatable-font-size-01 dt-center"}
          ],
          language : languageTable
    } );
  }, 500);
}

function createTableLocalidadContinuidad(){
  
  setTimeout(()=>{  
    $('#table-localidad-continuidad').DataTable( {
          retrieve: true,
          pagingType: 'full_numbers',
          pageLength: 10,
          processing: true,
          lengthMenu : [10, 50, 100],
          scrollX: true,
          "columnDefs": [
            {"targets": "_all", "className": "datatable-font-size-01 dt-center"}
          ],
          language : languageTable
    } );
  }, 500);
}

function createTableSector(){
  
  setTimeout(()=>{  
    $('#table-sector-variables').DataTable( {
          retrieve: true,
          pagingType: 'full_numbers',
          pageLength: 10,
          processing: true,
          lengthMenu : [10, 50, 100],
          scrollX: true,
          "columnDefs": [
            {"targets": "_all", "className": "datatable-font-size-01 dt-center"}
          ],
          language : languageTable
    } );
  }, 500);

  setTimeout(()=>{  
    $('#table-sector-conexiones').DataTable( {
          retrieve: true,
          pagingType: 'full_numbers',
          pageLength: 10,
          processing: true,
          lengthMenu : [10, 50, 100],
          scrollX: true,
          "columnDefs": [
            {"targets": "_all", "className": "datatable-font-size-01 dt-center"}
          ],
          language : languageTable
    } );
  }, 500);

}

function createTableTotal(){
  
  setTimeout(()=>{  
    $('#table-total').DataTable( {
          retrieve: true,
          pagingType: 'full_numbers',
          pageLength: 10,
          processing: true,
          lengthMenu : [10, 50, 100],
          scrollX: true,
          "columnDefs": [
            {"targets": "_all", "className": "datatable-font-size-01 dt-center"}
          ],
          language : languageTable
    } );
  }, 750);
}

function createTableSatisfactorio(){

  setTimeout(()=>{  
    $('#table-satisfactorio').DataTable( {
          retrieve: true,
          pagingType: 'full_numbers',
          pageLength: 10,
          processing: true,
          lengthMenu : [10, 50, 100],
          scrollX: true,
          "columnDefs": [
            {"targets": "_all", "className": "datatable-font-size-01 dt-center"}
          ],
          language : languageTable
    } );
  }, 750);
}

function updateTituloModulo(tituloModulo){

  if($('#tituloModulo').length>0){
    $('#tituloModulo').html(tituloModulo)
  }
}

function updateMenuOption(menuOption){
  
  let idMenuOption = "#"+menuOption;
  
  if($(idMenuOption).length>0){
    updateMenuOptionActive(idMenuOption);
  }

}

function updateMenuOptionActive(idMenuOption){
  
  if($(idMenuOption).data('container-level').length>0){
      
    let classSimilarLevel = "."+$(idMenuOption).data('container-level')+"-option";

    $(classSimilarLevel).each(function(){
      $(this).removeClass('active');
    });
  }

  $(idMenuOption).addClass('active');
}