/////////////////////////////////////////////////////////////////////
// day-by-day-head.js                                              //
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
var date_now = new Date();
var this_day;
var month = date_now.getMonth() + 1;
var year = date_now.getFullYear();
var databasebreak;

var awstats_url = window.location.pathname;
var awstats_arg = window.location.search.slice(1);
var argument = awstats_arg.split("&");
for (var i = 0; argument[i] != undefined; i++) {
  if (argument[i].slice(0, 4) == 'day=') {
    this_day = argument[i].replace(/^day=/, '');
  } else if (argument[i].slice(0, 10) == 'framename=') {
    argument[i] = '';
  } else if (argument[i].slice(0, 7) == 'output=') {
    argument[i] = '';
  } else if (argument[i].slice(0, 5) == 'year=') {
    year = argument[i].slice(5);
  } else if (argument[i].slice(0, 6) == 'month=') {
    month = argument[i].slice(6);
  } else if (argument[i].slice(0, 14) == 'databasebreak=') {
    databasebreak = argument[i].slice(14);
    argument[i] = '';
  }
}

var days_month = 31;
if (month == 4 || month == 6 || month == 9 || month == 11) {
  days_month = 30;
} else if (month == 2) {
  if (year % 4 == 0) {
    days_month = 29;
  } else {
    days_month = 28;
  }
}

document.write('<br />');
document.write('<table class="aws_border" border="0" cellpadding="2" cellspacing="0" width="100%"><tr><td>');
document.write('<table class="aws_data" border="0" cellpadding="1" cellspacing="0" width="100%"><tr valign="middle">');
document.write('<td class="aws" valign="middle" width="150"><b>Day of month:</b>&nbsp;</td>');
var d2;
for (var d = 1; d <= days_month; d++) {
  if (d < 10) {
    d2 = '0' + d;
  } else {
    d2 = d;
  }
  document.write('<td class="aws" valign="middle"><a href="' + awstats_url + '?');
  for (i = 0; argument[i] != undefined; i++) {
    if (argument[i] != '' && argument[i].slice(0, 4) != 'day=') {
      if (i != 0) {
        document.write('&');
      }
      document.write(argument[i]);
    }
  }
  document.write('&databasebreak=day&day=' + d2 + ' " target="_top">');
  if (d == this_day) {
    document.write('<strong>' + d + '</strong>');
  } else {
    document.write(d);
  }
  document.write('</a></td>');
}
for (var d = days_month + 1; d <= 31; d++) {
  document.write('<td class="aws" valign="middle">&nbsp;</td>');
}
document.write('</tr>');
document.write('<tr valign="middle">');
document.write('<td class="aws" valign="middle" width="150">');
if (this_day != undefined) {
  document.write('<a href="' + awstats_url + '?');
  for (i = 0; argument[i] != undefined; i++) {
    if (argument[i] != '' && argument[i].slice(0, 4) != 'day=') {
      if (i != 0) {
        document.write('&');
      }
      document.write(argument[i]);
    }
  }
  document.write('" " target="_top">Back to monthly report</a><br>');
}
document.write('</td><td>&nbsp;<br>&nbsp;</td>');
document.write('<td colspan="30" style="text-align:right;"><a href="http://www.internetofficer.com/awstats/day-by-day/" target="_top"><strong>AWStats Day by Day</strong></a> &copy;2008-2010 InternetOfficer SPRL&nbsp;</td>');
document.write('</tr></table>');
document.write('</td></tr></table>');