jQuery.ready(

  function() {

    window.Provincia = Backbone.Model.extend({

    });
    
    window.ProvinciasCollection = Backbone.Collection.extend({ 
      
      model: Provincia
      
    });
    
    window.Provincias = new ProvinciasCollection();
    
    window.ProvinciasView = Backbone.View.extend({

      el:  $("div.content"), 
      
      render: function() {
        this.el.html("<h1>Pepe</h1>");
      }

    });
    
    window.App = new ProvinciasView;
    
    
  }
  
);