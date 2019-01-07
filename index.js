
/*
Load the data, process it, and then cal display data with the result
*/
Promise.all([
  d3.csv("census2000.csv"),
]).then(function (files) {
  var data = files[0].map(v => {
    var sex = v.Sex === '1' ? 'male' : 'female';
    return {
      count: v.People,
      year: parseInt(v.Year),
      sex: sex,
      age: v.Age
    };
  });
  displayData(data);
}).catch(function (err) {
  console.log('Error parsing the data');
  console.log(err);
  alert('error parsing the data');
})

function displayData(dataset) {
  console.log(dataset);

  var datacount = dataset.length;
  var maxCount = Math.max.apply(Math,
    dataset.map(function (d) {
      return d.count;
    }));

  var men1900 = [];
  var women1900 = [];
  var men2000 = [];
  var women2000 = [];

  // seperate the data into seperate sets
  dataset.forEach(d => {
    if (d.sex === 'male') {
      if (d.year === 1900) {
        men1900.push(d);
      } else {
        men2000.push(d);
      }
    } else {
      if (d.year === 1900) {
        women1900.push(d);
      } else {
        women2000.push(d);
      }
    }
  });

  console.log('the age divided datasets');
  console.log(men1900);
  console.log(men2000);
  console.log(women1900);
  console.log(women2000);

  ratioMenToWomen1900 = [];
  ratioMenToWomen2000 = [];

  men1900.forEach(el => {
    var women = women1900.find(function (element) {
      return element.age === el.age;
    });
    console.log('the women for this man');
    console.log(women);
    var countDifferenceForYear = el.count - women.count;
    console.log('the count difference for the year');
    console.log(countDifferenceForYear);
    var ratioForYear = el.count / women.count;
    var result = {
      year: 1900,
      count: countDifferenceForYear,
      ratio: ratioForYear,
      age: el.age,
    };
    console.log(result);
    ratioMenToWomen1900.push(result);
  });

  men2000.forEach(el => {
    var women = women2000.find(function (element) {
      return element.age === el.age;
    });
    var countDifferenceForYear = el.count - women.count;
    var ratioForYear = el.count / women.count;
    var result = {
      year: 2000,
      count: countDifferenceForYear,
      ratio: ratioForYear,
      age: el.age,
    };
    ratioMenToWomen2000.push(result);
  });

  console.log('the ratios for the years');
  console.log(ratioMenToWomen1900);
  console.log(ratioMenToWomen2000);

  var maxCount1900 = Math.max.apply(Math,
    ratioMenToWomen1900.map(function (d) {
      return Math.abs(d.count);
    }));

  var maxCount2000 = Math.max.apply(Math,
    ratioMenToWomen2000.map(function (d) {
      return Math.abs(d.count);
    }));

  var overallMax = Math.max(maxCount1900, maxCount2000);
  console.log('the overall max ' + overallMax);

  var leftSidebarWidth = document.getElementsByClassName('left-sidebar')[0].clientWidth;

  var pageHeight = document.getElementsByClassName('another-container')[0].clientHeight;
  var sectionWidth = document.getElementById('container').clientWidth - 7;
  var midPage = (pageHeight / 2) - 100;

  // mid Page is the bottom line
  var midLineStyle = document.getElementsByClassName('mid-line')[0].style;
  var nineMoreLineStyle = document.getElementsByClassName('nine-million-more')[0].style;
  var sixMoreLineStyle = document.getElementsByClassName('six-million-more')[0].style;
  var threeMoreLineStyle = document.getElementsByClassName('three-million-more')[0].style;
  var threeLessLineStyle = document.getElementsByClassName('three-million-less')[0].style;
  midLineStyle.bottom = midPage + "px";
  // 1442989
  nineMoreLineStyle.bottom = (midPage + 0.5 * (1500000 / overallMax * pageHeight)) + "px";
  sixMoreLineStyle.bottom = (midPage + 0.5 * (1000000 / overallMax * pageHeight)) + "px";
  threeMoreLineStyle.bottom = (midPage + 0.5 * (500000 / overallMax * pageHeight)) + "px";
  threeLessLineStyle.bottom = (midPage - 0.5 * (500000 / overallMax * pageHeight)) + "px";

  d3.select(".year-2000")
    .selectAll("div")
    .data(ratioMenToWomen2000)
    .enter()
    .append("div")
    .attr("class", "bar")
    .style("height", function (d) {
      var barHeight = 0.5 * (Math.abs(d.count) / overallMax * pageHeight);
      return barHeight + "px";
    })
    .style("width", function (d) {
      var barWidth = ((sectionWidth / 19) - 1);
      return barWidth + "px";
    })
    .style("position", "absolute")
    .style("bottom", function (d) {
      if (d.count < 0) {
        return midPage + "px";
      } else {
        var pos = midPage - (0.5 * (Math.abs(d.count) / overallMax * pageHeight));
        return pos + "px";
      }
    })
    .style("left", function (d) {
      var position = (parseInt(d.age) / 5 * ((sectionWidth / 19))) + 17 + leftSidebarWidth + sectionWidth;
      return position + "px";
    })

  d3.select(".year-1900")
    .selectAll("div")
    .data(ratioMenToWomen1900)
    .enter()
    .append("div")
    .attr("class", "bar")
    .style("height", function (d) {
      var barHeight = 0.5 * (Math.abs(d.count) / overallMax * pageHeight);
      return barHeight + "px";
    })
    .style("width", function (d) {
      var barWidth = ((sectionWidth / 19) - 1);
      return barWidth + "px";
    })
    .style("position", "absolute")
    .style("bottom", function (d) {
      if (d.count < 0) {
        return midPage + "px";
      } else {
        var pos = midPage - (0.5 * (Math.abs(d.count) / overallMax * pageHeight));
        return pos + "px";
      }
    })
    .style("left", function (d) {
      var position = (parseInt(d.age) / 5 * ((sectionWidth / 19))) + 10 + leftSidebarWidth;
      return position + "px";
    })

}