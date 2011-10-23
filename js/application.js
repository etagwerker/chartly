$(document).ready(

  function() {
    
    window.Provincia = Backbone.Model.extend({

    });
    
    window.Departamento = Backbone.Model.extend({

    });    
    
    window.DepartamentosCollection = Backbone.Collection.extend({ 
      url: 'http://censo.heroku.com/departamentos?callback=?', 
      model: Departamento
      
    });
    
    window.ProvinciasCollection = Backbone.Collection.extend({ 
      url: 'http://censo.heroku.com/provincias?callback=?', 
      model: Provincia
      
    });
    
    
    window.Provincias = new ProvinciasCollection();
    window.Departamentos = new DepartamentosCollection();    
    
    window.ProvinciasView = Backbone.View.extend({

      el:  $("div.content"), 
      
      template: "<b>Pepe</b>", 
      
      render: function() {
        this.el.html("<h1>Pepe</h1>");
      }

    });
      
    window.App = new ProvinciasView;
    
    window.Provincias.fetch({
              success: function() {
                console.log('Provincias cargadas: ' + window.Provincias.length + '.');
              }, 
              error: function() {
                console.log('Error cargando provincias!');
              }});
    window.Departamentos.fetch({
              success: function() {
                console.log('Departamentos Cargados: ' + window.Departamentos.length + '.');
              }, 
              error: function() {
                console.log('Error cargando departamentos!');
              }});    
  }
  
);