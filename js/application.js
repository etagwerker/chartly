$(document).ready(
  
  function() {
    function tidy_id(_id) { 
      _id = _id.replace('í','i');
      _id = _id.replace('ú','u');
      _id = _id.replace('ó','o');
      _id = _id.replace('é','e');
      _id = _id.replace('á','a');
      return _id;                                
    }; 
    
    window.Population = Backbone.Model.extend({
      
      url: function() {
        var area = this.get('area');
        return 'http://censo.heroku.com/poblacion/' + tidy_id(area.id) + "/totales?callback=?";
      }, 
      
      parse: function(response) {
        this.set({total_mujeres: response.total_mujeres, total_varones: response.total_varones});
      }      
    }); 
    
    window.Provincia = Backbone.Model.extend({
      
      departamentos: function() {
        if (this.get('departamentos')) {
          return this.get('departamentos');
        } else {
          var provincia = this;
          var collection = new DepartamentosCollection();
          collection.fetch({success: function() {
              provincia.set({departamentos: collection});
              window.DepartamentosPartialView.addAll();
            }
          });
        }
      }
      
    });
    
    window.Departamento = Backbone.Model.extend({

    });    

    // class DepartamentosCollection
    window.DepartamentosCollection = Backbone.Collection.extend({ 
      model: Departamento, 
      
      url: function() {
        return 'http://censo.heroku.com/' + tidy_id(window.CurrentProvincia.get('id')) + '/departamentos?callback=?';
      }
      
    });

    // class ProvinciasCollection    
    window.ProvinciasCollection = Backbone.Collection.extend({ 
      url: 'http://censo.heroku.com/provincias?callback=?', 
      model: Provincia
      
    });
    
    // object Provincias        
    window.Provincias = new ProvinciasCollection();

    // object Departamentos
    window.Departamentos = new DepartamentosCollection();
    
    window.PopulationView = Backbone.View.extend({
      template: _.template($('#population-template').html()),
      
      population_graph: function(population) {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Sexo');
        data.addColumn('number', 'Personas');
        data.addRows(2);
        data.setValue(0, 0, 'Varones');
        data.setValue(0, 1, population.get('total_varones'));
        data.setValue(1, 0, 'Mujeres');
        data.setValue(1, 1, population.get('total_mujeres'));

        // Create and draw the visualization.
        var chart = new google.visualization.PieChart(document.getElementById('population-graph'));
        var area = population.get('area');
        chart.draw(data, {width: 450, height: 300, title: 'Personas en ' + area.get('nombre') });
      },
      
      initialize: function() {
        var v = this;
        var p = new Population({area: this.model, view: v});
        p.fetch({success: function(){
            v.model.set({population: p});
            $("div#population-detail").html(v.render().el);
            v.population_graph(p);
            window.DepartamentosPartialView = new DepartamentosView({model: v.model});            
          }
        });
      }, 
      
      render: function() {
        var population = this.model.get('population');
        $(this.el).html(this.template(population.toJSON()));
        return this;
      }
      
    });
    
    window.DepartamentoView = Backbone.View.extend({
      template: _.template($('#departamento-template').html()),
      
      initialize: function() {
        
      },

      render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
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
        window.CurrentProvincia = this.model;
        this.model.set({selected: true});
        new PopulationView({model: this.model});
      },
      
      render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
      }
      

    });
    
    window.DepartamentosView = Backbone.View.extend({      
      initialize: function() {
        this.model.departamentos();
      },

      // Add a single departamento to the list by creating a view for it, and
      // appending its element to the `<ul>`.
      addOne: function(departamento) {
        var view = new DepartamentoView({model: departamento});
        $("ul#departamentos-list").append(view.render().el);
      },

      // Add all items in the **Provincias** collection at once.
      addAll: function() {
        var departamentos = this.model.departamentos();
        departamentos.each(this.addOne);
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
      }
    });
      
    window.App = new AppView;
    
  }
  
);