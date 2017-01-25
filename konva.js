$(document).ready(function() {

  var width = 240;
  var height = 480;

  var stage = new Konva.Stage({
    container: 'draw-shapes',   // id of container <div>
    width: width,
    height: height
  });

  var radius = 60;
  var hex_height = .5 * Math.sqrt(3) * radius;

  var layer = new Konva.Layer();
  var plant_layer = new Konva.Layer();

  var y = (height / 2 * -1);
  var x_offset = false;

  while (y < height / 2 + radius) {

    var x = width / 2 * -1;

    if (x_offset) {
     x += radius;
    }

    while (x < width / 2 + radius) {

      addSpacing(stage, layer, radius, x, y);

      addPlant(stage, plant_layer, x + width/2, y + height/2, radius);
      addPlant(stage, plant_layer, x + width/2 - radius/2, y + height/2 - (hex_height), radius);
      addPlant(stage, plant_layer, x + width/2 + radius/2, y + height/2 - (hex_height), radius);
      addPlant(stage, plant_layer, x + width/2 + radius, y + height/2, radius);

      x += radius * 2;
    }

    y += hex_height * 2;
    x_offset = !x_offset;
  }

  stage.add(layer);
  stage.add(plant_layer);

  var plant_count = 0;
  plant_layer.children.forEach(function(child) {
    if (child.name() == 'plant') { plant_count++; };
  })
  $('#plant_count').html(plant_count);

});

function addPlant(stage, layer, x, y, radius) {

  if (x - radius/2 + 1 > 0 && x + radius/2 + 1 < stage.getWidth() && y - radius/2 + 1 > 0 & y + radius/2 + 1 < stage.getHeight()) {
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
      radius: 10,
      fill: 'green',
      strokeWidth: 0,
      name: 'plant',
    }));
  }

}

function addSpacing(stage, layer, radius, x, y) {

  var group = new Konva.Group({
    x: x,
    y: y,
   });

   var points = [
     stage.getWidth() / 2 - radius, stage.getHeight() / 2,
     stage.getWidth() / 2 + radius, stage.getHeight() / 2
   ];

  group.add(new Konva.Line({
    points: points,
    stroke: '#ACACAC',
    strokeWidth: 1,
  }));


  points = [
    stage.getWidth() / 2 - radius / 2,
    stage.getHeight() / 2 - radius + 10 + 6,

    stage.getWidth() / 2 + radius / 2,
    stage.getHeight() / 2 + radius - 10 - 6,
  ];

  group.add(new Konva.Line({
    points: points,
    stroke: '#ACACAC',
    strokeWidth: 1,
  }));


  points = [
    stage.getWidth() / 2 - radius / 2,
    stage.getHeight() / 2 + radius - 10 - 6,

    stage.getWidth() / 2 + radius / 2,
    stage.getHeight() / 2 - radius + 10 + 6
  ];

  group.add(new Konva.Line({
    points: points,
    stroke: '#ACACAC',
    strokeWidth: 1,
  }));


  var plant = new Konva.RegularPolygon({
    x: stage.getWidth() / 2,
    y: stage.getHeight() / 2,
    radius: radius,
    sides: 6,
    stroke: '#ACACAC',
    strokeWidth: 0,
    rotation: 30,
  });


  group.add(plant);

  layer.add(group);
}