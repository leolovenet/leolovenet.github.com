/////////////////////////////////////////////////////////////////////
// day-by-day-end.js                                               //
//                                                                 //
// Copyright 2008-2010 INTERNETOFFICER SPRL.                       //
//                                                                 //
// InternetOfficer SPRL                                            //
// Avenue de Meysse 115                                            //
// 1020 Brussels                                                   //
// Belgium                                                         //
//                                                                 //
// For more information and license terms, visit:                  //
// http://www.internetofficer.com/awstats/day-by-day/              //
//                                                                 //
// For comments and questions, visit:                              //
// http://www.internetofficer.com/forum/awstats-day-by-day/        //
//                                                                 //
/////////////////////////////////////////////////////////////////////
if (databasebreak == 'day') {
  var done = false;
  var element = document.getElementsByTagName("input");
  for (var i = 0; i < element.length && !done; i++) {
    if (element[i].className == 'aws_button') {
      for (var j = 0; j < element[i].attributes.length; j++) {
        if (element[i].attributes[j].nodeName.toLowerCase() == 'value') {
          element[i].attributes[j].nodeValue = ' Disabled ';
          element[i].disabled = true;
          done = true;
        }
      }
    }
  }

  var element_a = document.getElementsByTagName("a");
  var a_month_pointer = 0;
  var a_daysofmonth_pointer = 0;
  var a_daysofweek_pointer = 0;
  var i2 = 0;
  for (var i = 0; i < element_a.length; i++) {
    if (element_a[i].name != '') {
      if (element_a[i].name == 'month') {
        a_month_pointer = i2;
      } else if (element_a[i].name == 'daysofmonth') {
        a_daysofmonth_pointer = i2;
      } else if (element_a[i].name == 'daysofweek') {
        a_daysofweek_pointer = i2;
      }
      i2++;
    }
  }

  var element_table = document.getElementsByTagName("table");
  var table_pointer = new Array();
  var j2 = 0;
  for (var j = 0; j < element_table.length; j++) {
    if (element_table[j].className == 'aws_border sortable') {
      table_pointer[j2] = j;
      j2++;
    }
  }

  if (a_month_pointer > 0) {
    element_table[table_pointer[a_month_pointer - 1]].style.display = 'none';
  }
  if (a_daysofmonth_pointer > 0) {
    element_table[table_pointer[a_daysofmonth_pointer - 2]].style.display = 'none';
  }
  if (a_daysofweek_pointer > 0) {
    element_table[table_pointer[a_daysofweek_pointer - 2]].style.display = 'none';
  }
}