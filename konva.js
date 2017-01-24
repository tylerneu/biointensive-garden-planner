$(document).ready(function() {

  // first we need to create a stage
  var stage = new Konva.Stage({
    container: 'draw-shapes',   // id of container <div>
    width: 500,
    height: 500
  });

  var grid = new Konva.Layer();

  var radius = 75;

  // i = 25;
  // while (i < 500) {
  //
  //   grid.add(new Konva.Line({
  //     points: [0, i, 500, i],
  //     stroke: '#F0F0F0',
  //     strokeWidth: 1,
  //   }));
  //
  //   grid.add(new Konva.Line({
  //     points: [i, 0, i, 500],
  //     stroke: '#F0F0F0',
  //     strokeWidth: 1,
  //   }));
  //
  //   i += 25;
  // }


   stage.add(grid);

  // then create layer
  var layer = new Konva.Layer();

  addPlant(stage, layer, radius);

  stage.add(layer);

  $('#add').click(function() {
    layer.add(addPlant(stage, radius));
    layer.draw()
  })

});

function addPlant(stage, layer, radius) {

  // var group = new Konva.Group({
  //      draggable: true
  //  });

  layer.add(new Konva.Line({
    points: [stage.getWidth() / 2, stage.getHeight() / 2 - radius, stage.getWidth() / 2, stage.getHeight() / 2 + radius],
    stroke: 'black',
    strokeWidth: 1,
  }));

  layer.add(new Konva.Line({
    points: [stage.getWidth() / 2 - radius + 10, stage.getHeight() / 2, stage.getWidth() / 2 + radius - 10, stage.getHeight() / 2],
    stroke: 'black',
    strokeWidth: 1,
  }));

  var plant = new Konva.RegularPolygon({
    x: stage.getWidth() / 2,
    y: stage.getHeight() / 2,
    radius: radius,
    sides: 6,

    stroke: 'black',
    strokeWidth: 0,
    draggable: true,
    dragBoundFunc: function(pos) {

      var x;
      if (pos.x > (stage.getWidth() - radius)) {
        x = stage.getWidth() - radius + 10;
      } else if (pos.x < (radius)) {
        x = radius - 10;
      } else {
        x = Math.round(pos.x / 25) * 25;
      }

      var y;
      if (pos.y > (stage.getHeight() - radius)) {
        y = stage.getHeight() - radius;
      } else if (pos.y < (radius)) {
        y = radius;
      } else {
        y = Math.round(pos.y / 25) * 25;
      }

      return {
          x: x,
          y: y,
      }
    }

  });

  layer.add(plant);
}