$(document).ready(function() {

  plant();

  $("#form").submit(function(event) {
    plant()
    event.preventDefault();
  });

  $("#plant_spacing").change(function() {
    plant()
  });

});

function plant() {

  var width = $("#width").val() * 120;
  var height = $("#height").val() * 120;
  var radius = $("#plant_spacing").val() * 10;
  var hex_height = .5 * Math.sqrt(3) * radius;

  var stage = new Konva.Stage({
    container: 'draw-shapes',
    width: width,
    height: height
  });

  var plant_layer = new Konva.Layer();
  var grid_layer = new Konva.Layer();

  grid_layer.add(new Konva.Line({
    points: [0, 0, height/1.732, height],
    stroke: 'black',
    strokeWidth: 1,
  }));

  var y_offset = 0;
  var x_offset = -width * radius;

  while (x_offset < width * 3) {

    grid_layer.add(new Konva.Line({
      points: [0 + x_offset, 0 + y_offset, height/1.732 + x_offset, height],
      stroke: 'black',
      strokeWidth: 1,
    }));

    grid_layer.add(new Konva.Line({
      points: [0 + x_offset, 0 + y_offset, height/-1.732 + x_offset, height],
      stroke: 'black',
      strokeWidth: 1,
    }));

    x_offset += radius;
  }

  y_offset = hex_height;

  while (y_offset < height) {
    grid_layer.add(new Konva.Line({
      points: [0, 0 + y_offset, width, y_offset],
      stroke: 'black',
      strokeWidth: 1,
    }));

    y_offset += hex_height;
  }

  // ========================================================

  var y = 0;
  var x_offset = false;

  var plant_count = 0;

  while (y < height) {

    var x = 0;
    if (x_offset) {
      x += radius/2;
    }

    while (x < width) {

      if (addPlant(stage, plant_layer, x, y, radius)) {
        plant_count ++;
      }
      x += radius;
    }

    y += hex_height;
    x_offset = !x_offset;

  }

  // ========================================================

  $('#plant_count').html(plant_count);

  stage.add(grid_layer);
  stage.add(plant_layer);
}

function addPlant(stage, layer, x, y, radius) {

  if (x - radius/2 + 1 > 0 &&
      x + radius/2 - 1 < stage.getWidth() &&
      y - radius/2 + 1 > 0 &&
      y + radius/2 - 1 < stage.getHeight()
  ) {

    layer.add(new Konva.Circle({
      x: x,
      y: y,
      radius: radius/2,
      fill: '#ACACAC',
      strokeWidth: 0,
      opacity: 0.25,
    }));

    layer.add(new Konva.Circle({
      x: x,
      y: y,
      radius: radius/4,
      fill: 'green',
      strokeWidth: 0,
      name: 'plant',
    }));

    return true;
  }

  return false;

}

// function addSpacing(stage, layer, radius, x, y) {
//
//   var group = new Konva.Group({
//     x: x,
//     y: y,
//    });
//
//    var points = [
//      stage.getWidth() / 2 - radius, stage.getHeight() / 2,
//      stage.getWidth() / 2 + radius, stage.getHeight() / 2
//    ];
//
//   group.add(new Konva.Line({
//     points: points,
//     stroke: '#ACACAC',
//     strokeWidth: 1,
//   }));
//
//
//   points = [
//     stage.getWidth() / 2 - radius / 2,
//     stage.getHeight() / 2 - radius + 10 + 6,
//
//     stage.getWidth() / 2 + radius / 2,
//     stage.getHeight() / 2 + radius - 10 - 6,
//   ];
//
//   group.add(new Konva.Line({
//     points: points,
//     stroke: '#ACACAC',
//     strokeWidth: 1,
//   }));
//
//
//   points = [
//     stage.getWidth() / 2 - radius / 2,
//     stage.getHeight() / 2 + radius - 10 - 6,
//
//     stage.getWidth() / 2 + radius / 2,
//     stage.getHeight() / 2 - radius + 10 + 6
//   ];
//
//   group.add(new Konva.Line({
//     points: points,
//     stroke: '#ACACAC',
//     strokeWidth: 1,
//   }));
//
//
//   var plant = new Konva.RegularPolygon({
//     x: stage.getWidth() / 2,
//     y: stage.getHeight() / 2,
//     radius: radius,
//     sides: 6,
//     stroke: '#ACACAC',
//     strokeWidth: 0,
//     rotation: 30,
//   });
//
//
//   group.add(plant);
//
//   layer.add(group);
// }