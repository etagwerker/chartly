$(document).ready(

  function() {
    
    window.Population = Backbone.Model.extend({
      url: function() {
        var area = this.get('area');
        return 'http://censo.heroku.com/poblacion/' + area.id + "/totales?callback=?";
      }, 
      
      parse: function(response) {
        this.set({total_mujeres: response.total_mujeres, total_varones: response.total_varones});
      }      
    }); 
    
    window.Provincia = Backbone.Model.extend({
      
    });
    
    window.Departamento = Backbone.Model.extend({

    });    

    // class DepartamentosCollection
    window.DepartamentosCollection = Backbone.Collection.extend({ 
      url: 'http://censo.heroku.com/departamentos?callback=?', 
      model: Departamento
      
    });

    // object Departamentos
    window.Departamentos = new DepartamentosCollection();    

    // class ProvinciasCollection    
    window.ProvinciasCollection = Backbone.Collection.extend({ 
      url: 'http://censo.heroku.com/provincias?callback=?', 
      model: Provincia
      
    });
    
    // object Provincias        
    window.Provincias = new ProvinciasCollection();
    
    window.PopulationView = Backbone.View.extend({
      template: _.template($('#population-template').html()),
      
      initialize: function() {
        var v = this;
        var p = new Population({area: this.model, view: v});
        p.fetch({success: function(){
            v.model.set({population: p});
            $("div#population-detail").html(v.render().el)
          }
        });
      }, 
      
      render: function() {
        var population = this.model.get('population');
        $(this.el).html(this.template(population.toJSON()));
        return this;
      }
      
    });
    
    window.ProvinciaView = Backbone.View.extend({

      template: _.template($('#provincia-template').html()),
      
      events: {
        "click"         : "select"
      },
      
      initialize: function() {
        
      },

      select: function() {
        this.model.set({selected: true});
        new PopulationView({model: this.model});
      },
      
      render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
      }
      

    });
    
    window.ProvinciasView = Backbone.View.extend({      
      initialize: function() {
        
        this.addAll();
        
      },
      
      // Add a single provincia to the list by creating a view for it, and
      // appending its element to the `<ul>`.
      addOne: function(provincia) {
        console.log("Added: " + provincia.get('id'));
        var view = new ProvinciaView({model: provincia});
        $("ul#provincias-list").append(view.render().el);
      },

      // Add all items in the **Provincias** collection at once.
      addAll: function() {
        window.Provincias.each(this.addOne);
      }
      
    });
    
    
    window.AppView = Backbone.View.extend({
      // Instead of generating a new element, bind to the existing skeleton of
      // the App already present in the HTML.
      el: $("#charts-app"),

      initialize: function() {
        window.Provincias.fetch({
          success: function() {
            console.log('Provincias cargadas: ' + window.Provincias.length + '.');
            new ProvinciasView;
          }, 
          error: function() {
            console.log('Error cargando provincias!');
          }
        });
        window.Departamentos.fetch({
          success: function() {
            console.log('Departamentos Cargados: ' + window.Departamentos.length + '.');
          }, 
          error: function() {
            console.log('Error cargando departamentos!');
          }
        });
      }
    });
      
    window.App = new AppView;
    
  }
  
);