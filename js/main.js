var today, d2, d1;

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function weekend(day) {
    var r = new Date(today[0].getFullYear(), today[0].getMonth(), day).getDay();

    if (r == 0 || r == 6 || adjustments_de.freedays[today[0].getMonth()].indexOf(day + '.') != -1) {
        return false;
    }

    return r;
}


var arrow = function(e) {

    if (!e) {

        e = window.event;

    }

    if (e.keyCode == 13) {

        window.removeEventListener('keyup', arrow, false);


        d2 = (document.getElementById('d2').value.length == 2) ? '20' + document.getElementById('d2').value : document.getElementById('d2').value;

        var str = document.getElementById('d1').value;
        str = str.charAt(0).toUpperCase() + str.slice(1);

        d1 = (adjustments_de.monthNames.indexOf(str) != -1) ? adjustments_de.monthNames.indexOf(str) : parseInt(document.getElementById('d1').value) - 1;

        today = (new Date().getMonth() == d1) ? [new Date()] : [new Date(d2, parseInt(d1) + 1, 0)];

        //		Datum aktueller Monat	new Date();

        //		Datum selber festlegen	new Date(2017,2,31);	//	31. März 2017

        today.push(daysInMonth(today[0].getMonth() + 1, today[0].getFullYear()), today[0].getMonth(), today[0].getFullYear());

        document.getElementById('header').children[0].innerHTML += ' ' + adjustments_de.monthNames[d1] + ' ' + d2;

        document.getElementById('start').style.display = 'none';

        text_load(d2, d1);

    }

};


var quarter = function(t, dif) {

    var target = t.parentNode.getElementsByClassName('z')[0];

    switch (true) {
        case (dif < 0):
            target.value = (target.value != '') ? parseFloat(target.value) + +parseFloat(dif) : 7;
            if (target.value <= 0) {
                target.value = '';
            }
            break;
        case (dif > 0):
            target.value = (target.value != '') ? parseFloat(target.value) + parseFloat(dif) : 7;
            break;
        default:
            target.value = '';
    }

    sh_z_edit(target);


};

var sevenifzero = function(t) {
    if (t.value != '' && t.parentNode.parentNode.getElementsByClassName('z')[0].value == '') {
        t.parentNode.parentNode.getElementsByClassName('z')[0].value = 7;
    }

    sh_z_edit(t.parentNode.parentNode.getElementsByClassName('z')[0]);

};

var sh_z_edit = function(t) {

    console.log('ichange');

    t.nextSibling.nextSibling.style.visibility = (t.value != '') ? 'visible' : 'hidden';

};

var optional = function(t, ix) {

    if (t.children[0].classList.contains('fake_checkbox_vis')) {
        t.children[0].classList.remove('fake_checkbox_vis');
        t.children[1].value = '';
    } else {
        t.children[0].classList.add('fake_checkbox_vis');
        t.children[1].value = 'X';
    }

};

var fillTableDays = function(el) {

    var els = el.children[0].children.length;

    for (var i = 1; i < today[1] + 1; i++) {
        var tr = document.createElement('tr');

        tr.innerHTML = '<td>' + ((!weekend(i)) ? '' : adjustments_de.dayNamesMin[weekend(i)]) + '</td>';

        tr.innerHTML += '<td class="d">' + i + '.</td>';
        tr.innerHTML += '<td><i class="fa fa-minus-circle" aria-hidden="true" onclick="quarter(this,-0.5)"></i><input class="z" type="text" id="z' + i + '" value="' + select_pdf.save_raws.z[i - 1] + '" onfocus="this.value = 7;this.blur();" /><i class="fa fa-plus-circle" aria-hidden="true" onclick="quarter(this,0.5)"></i><i class="fa fa-times-circle" aria-hidden="true" onclick="quarter(this,0)"' + ((select_pdf.save_raws.z[i - 1] != '') ? ' style="visibility:visible;"' : '') + '></i></td>';

        for (var j = 3; j < els - 1; j++) {
            tr.innerHTML += '<td class="fa-check_parent" onclick="optional(this,' + j + ')"><i class="fa fa-check fake_checkbox ' + ((select_pdf.save_raws['hi' + j][i - 1] != '') ? 'fake_checkbox_vis' : '') + '" aria-hidden="true"></i><input class="hi' + j + '" type="hidden" value="' + select_pdf.save_raws['hi' + j][i - 1] + '" /></td>';
        }
        tr.innerHTML += '<td><input onblur="sevenifzero(this)" tabindex="' + i + '" class="b" type="text" id="b' + i + '" value="' + select_pdf.save_raws.b[i - 1] + '" /><i class="fa fa-github" aria-hidden="true"></i></td>';

        if (!weekend(i)) {
            tr.classList.add('freeday');
        }

        if (i > today[0].getDate()) {
            tr.classList.add('future');
        }

        el.appendChild(tr);

    }

};

adjustments_de = {

    freedays: [
        ["1.", "2."],
        [],
        [],
        ["14.", "17."],
        ["1.", "25."],
        ["5."],
        [],
        ["1."],
        [],
        [],
        [],
        ["25.", "26.", "31."]
    ],


    dayNames: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
    dayNamesMin: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
    monthNames: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
    monthNamesMin: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
    years: []

};


var define = function() {

    var f1 = document.getElementById('f1');
    var f2 = document.getElementById('f2');
    var f3 = document.getElementById('f3');
    var f4 = document.getElementById('f4');

    f1.value = user.name + ', ' + user.vorname;
    f2.value = user.einsatzplatz;
    f3.value = user.beschäftigungsgrad;
    f4.value = user.berater;

    fillTableDays(document.getElementById('form_body').children[0]);

    select_pdf.get_scr();



};

function loadXMLDoc(ud, cfunc, val) {

    xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = cfunc;

    if (typeof val === 'undefined') {

        xmlhttp.open("GET", ud, true);
        xmlhttp.send();

    } else {

        xmlhttp.open("POST", ud, true);

        xmlhttp.setRequestHeader("expires", "0");
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(val);

    }

};

var set_timespan = function() {

    document.getElementById('d1').value = adjustments_de.monthNames[new Date().getMonth()];
    document.getElementById('d2').value = new Date().getFullYear();

    window.addEventListener('keyup', arrow, false);

};

var text_load = function(d2, d1) {

    loadXMLDoc('presets/presets.js', function() {

        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {

                base = JSON.parse(xmlhttp.responseText).base;

                user = JSON.parse(xmlhttp.responseText).user;

                loadXMLDoc('presets/data_' + d2 + '_' + d1 + '.txt', function() {

                    if (xmlhttp.readyState == 4) {
                        if (xmlhttp.status == 200) {

                            select_pdf.save_raws = JSON.parse(xmlhttp.responseText);

                            define();

                        } else {

                            alert('No month file! A new one will be created.');

                            console.log(today[1]);

                            var blank_arr = [];

                            for (var i = 0; i < today[1]; i++) {
                                blank_arr.push("");
                            }

                            select_pdf.save_raws = {
                                "d": blank_arr,
                                "z": blank_arr,
                                "hi3": blank_arr,
                                "hi4": blank_arr,
                                "hi5": blank_arr,
                                "hi6": blank_arr,
                                "hi7": blank_arr,
                                "hi8": blank_arr,
                                "b": blank_arr
                            };

                            define();

                        }
                    }
                });

            } else {
                alert('presets shit happens');
            }
        }
    });

};

var pdf_m = false;

var select_pdf = {
    "disable": false,
    "sh_pdf": function(t) {

        if (t.children[0].classList.contains('check_pdf_dis')) {
            t.children[0].classList.remove('check_pdf_dis');
            select_pdf.disable = false;
        } else {
            t.children[0].classList.add('check_pdf_dis');
            select_pdf.disable = true;
        }

    },
    "get_scr": function() {
        if (!pdf_m) {

            var m = document.createElement('script');

            m.onload = function() {

                var f = document.createElement('script');

                f.onload = function() {

                    var i = document.createElement('script');

                    i.src = 'images/pdf_head_base64.js';
                    i.charset = 'utf-8';

                    document.head.appendChild(i);

                    //		new test
                    get_git();
                    //		end new
                };

                f.src = 'scripts/vfs_fonts.js';
                f.charset = 'utf-8';

                document.head.appendChild(f);
            };

            m.src = 'scripts/pdfmake.min.js';
            m.charset = 'utf-8';

            document.head.appendChild(m);

            pdf_m = true;

        }

    },
    "collect": function() {
        var tb = [
            [{
                    text: 'Tätigkeiten',
                    fontSize: 8,
                    bold: true
                },
                {
                    text: 'Eingeführt Datum',
                    fontSize: 8,
                    bold: true
                },
                {
                    text: '*',
                    fontSize: 8,
                    bold: true
                },
                {
                    text: 'Visum Vorgesetzter',
                    fontSize: 8,
                    bold: true
                }
            ]
        ];

        var ek = [
            [{
                    text: '',
                    fontSize: 10
                },
                {
                    text: 'Tag',
                    bold: true
                },
                {
                    text: 'Arbeitszeit\nin Stunden',
                    bold: true
                },
                {
                    text: 'Kurse',
                    bold: true
                },
                {
                    text: 'Vorstellen\nSchnuppern',
                    bold: true
                },
                {
                    text: 'Krank\nUnfall',
                    bold: true
                },
                {
                    text: 'RAV',
                    bold: true
                },
                {
                    text: 'Ferien',
                    bold: true
                },
                {
                    text: 'Anderes*',
                    bold: true
                },
                {
                    text: 'Bemerkungen',
                    bold: true
                }
            ]
        ];


        var raws = document.getElementById('form_body').getElementsByTagName('tr');
        select_pdf.save_raws = {
            "d": [],
            "z": [],
            "hi3": [],
            "hi4": [],
            "hi5": [],
            "hi6": [],
            "hi7": [],
            "hi8": [],
            "b": []
        };

        for (var i = 1; i < raws.length; i++) {
            if (raws[i].getElementsByClassName('b')[0].value != '') {
                tb.push([raws[i].getElementsByClassName('b')[0].value, raws[i].getElementsByClassName('d')[0].innerHTML + ' ' + adjustments_de.monthNames[today[2]], '', '']);
            }

            select_pdf.save_raws.d.push(raws[i].getElementsByClassName('d')[0].innerHTML);

            select_pdf.save_raws.z.push(raws[i].getElementsByClassName('z')[0].value);

            select_pdf.save_raws.hi3.push(raws[i].getElementsByClassName('hi3')[0].value);

            select_pdf.save_raws.hi4.push(raws[i].getElementsByClassName('hi4')[0].value);

            select_pdf.save_raws.hi5.push(raws[i].getElementsByClassName('hi5')[0].value);

            select_pdf.save_raws.hi6.push(raws[i].getElementsByClassName('hi6')[0].value);

            select_pdf.save_raws.hi7.push(raws[i].getElementsByClassName('hi7')[0].value);

            select_pdf.save_raws.hi8.push(raws[i].getElementsByClassName('hi8')[0].value);

            select_pdf.save_raws.b.push(raws[i].getElementsByClassName('b')[0].value);

            ek.push(
                [
                    '',
                    {
                        text: raws[i].getElementsByClassName('d')[0].innerHTML,
                        alignment: 'center'
                    },
                    {
                        text: raws[i].getElementsByClassName('z')[0].value,
                        alignment: 'center'
                    },
                    {
                        text: raws[i].getElementsByClassName('hi3')[0].value,
                        alignment: 'center'
                    },
                    {
                        text: raws[i].getElementsByClassName('hi4')[0].value,
                        alignment: 'center'
                    },
                    {
                        text: raws[i].getElementsByClassName('hi5')[0].value,
                        alignment: 'center'
                    },
                    {
                        text: raws[i].getElementsByClassName('hi6')[0].value,
                        alignment: 'center'
                    },
                    {
                        text: raws[i].getElementsByClassName('hi7')[0].value,
                        alignment: 'center'
                    },
                    {
                        text: raws[i].getElementsByClassName('hi8')[0].value,
                        alignment: 'center'
                    },
                    {
                        text: raws[i].getElementsByClassName('b')[0].value
                    }

                ]
            );

        }

        download_pdf(tb, ek);

    }

};

var base64;

var download_pdf = function(tb, ek) {

    var dd = {
        footer: function(currentPage, pageCount) {

            if (currentPage == 1 || (currentPage == 2 && pageCount > 3)) {

                return {
                    text: base.adress_tb,
                    style: 'mini',
                    margin: [40, -36, 0, 0]
                };

            }

            if (currentPage == pageCount) {

                return [{
                    text: ['Datum: ' + today[0].getDate() + '. ' + adjustments_de.monthNames[today[2]] + ' ' + today[3] + '   Visum Vorgesetzte/r Einsatzplatz:'],
                    style: 'smallheader',
                    margin: [40, -48, 0, 0]
                }, {
                    canvas: [{
                        type: 'line',
                        x1: 380,
                        y1: 12,
                        x2: 552,
                        y2: 12,
                        lineWidth: 1
                    }]
                }];
            }

            return '';

        },
        pageSize: 'A4',
        content: [],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, -20, 0, 0]
            },
            smallheader: {
                fontSize: 12,
                bold: true
            },
            mini: {
                fontSize: 8
            },
            defaultStyle: {
                fontSize: 10
            }
        }
    }

    var docDefinition = {
        content: dd
    };

    dd.content.push({
        image: base64,
        alignment: 'right',
        width: 147
    });

    //dd.content.push();

    dd.content.push({
        text: 'Tätigkeitsbericht',
        style: 'header'
    }, {
        text: 'AMM Berner Stellennetz\n\nTeilnehmer/in: ' + f1.value + '\n\nEinsatzplatz: ' + f2.value,
        fontSize: 10
    }, {
        text: '\n\n',
        fontSize: 10
    }, {
        fontSize: 10,
        table: {
            widths: [320, 70, 'auto', 80],
            body: tb
        }
    }, {
        text: '*Beurteilung: A = hervorragend B = gut C = mässig D = ungenügend\n\n',
        bold: true
    }, {
        fontSize: 10,
        table: {
            widths: [256, '*'],
            body: [
                ['Datum: ', today[0].getDate() + '. ' + adjustments_de.monthNames[today[2]] + ' ' + today[3]],
                ['', ''],
                ['Visum verantwortliche Fachperson / Leitung:', '']
            ]
        },
        layout: 'noBorders'
    }, {
        canvas: [{
            type: 'line',
            x1: 256,
            y1: 0,
            x2: 512,
            y2: 0,
            lineWidth: 1
        }]
    }, {
        text: '\nMit der Unterzeichnung bescheinigt der/die Teilnehmer/in:\n- vom Inhalt dieses Berichts Kenntnis genommen zu haben\n- über die Weiterleitung dieses Dokuments an den Personalberater der RAV informiert worden zu sein\n\n\n',
        fontSize: 10,
        bold: true
    }, {
        fontSize: 10,
        table: {
            widths: [256, 256],
            body: [
                ['Visum Teilnehmer/in:', '']
            ]
        },
        layout: 'noBorders'
    }, {
        canvas: [{
            type: 'line',
            x1: 256,
            y1: 0,
            x2: 512,
            y2: 0,
            lineWidth: 1
        }]
    }, {
        fontSize: 10,
        table: {
            widths: [256, 256],
            body: [
                ['', {
                    text: user.vorname + ' ' + user.name,
                    alignment: 'center'
                }]
            ]
        },
        layout: 'noBorders'
    });

    //	**************************************************************	page two	**************************************************************

    dd.content.push({
        image: base64,
        alignment: 'right',
        width: 147,
        pageBreak: 'before'
    });

    dd.content.push({
        text: 'Einsatz-Kontrollblatt AMM Berner Stellennetz',
        style: 'smallheader',
        margin: [0, -40, 0, 0]

    }, {
        text: base.adress_ek,
        margin: 0
    }, {
        fontSize: 10,
        table: {
            widths: [100, 'auto', '*'],
            body: [
                [{
                    text: 'Name / Vorname:',
                    bold: true
                }, {
                    text: f1.value,
                    bold: true
                }, {
                    text: 'Monat: ' + adjustments_de.monthNames[today[2]] + ' ' + today[3],
                    bold: true,
                    alignment: 'right'
                }],
                ['Einsatzplatz:', f2.value, {
                    text: f4.value,
                    alignment: 'right'
                }],
                ['Beschäftigungsgrad:', f3.value, '']
            ]
        },
        layout: 'noBorders'
    }, {
        text: ['\nDamit Sie ihr Arbeitslosentaggeld erhalten, senden Sie das vollständig ausgefüllte (inkl. Prognose) und durch die oder den Vorgesetzte/n unterschriebene Einsatzkontrollblatt ',
            {
                text: 'ab dem 25. des Monates',
                bold: true
            }, ' an das Berner Stellennetz.'
        ],
        style: 'defaultStyle'
    }, {
        text: ['Bei Einsatzende oder -abbruch bitte ', {
            text: 'sofort',
            bold: true
        }, ' einreichen (Kontaktdaten siehe Kopfzeile).'],
        style: 'defaultStyle'
    }, {
        text: '\nHinweis: Kompensationsstunden sind unter den Bemerkungen einzutragen.',
        style: 'defaultStyle'
    }, {
        fontSize: 10,
        table: {
            widths: [30, 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', '*'],
            body: ek
        }
    }, {
        text: '\n* vergleiche dazu Anhang zur Einsatzvereinbarung, Abwesenheiten (entschuldigte Absenzen)\n',
        style: 'mini'
    });

    if (!select_pdf.disable) {
        pdfMake.createPdf(dd).download('taetigkeitsbericht_' + adjustments_de.monthNames[today[2]].replace('ä', 'ae') + '.pdf');
        //pdfMake.createPdf(dd).open();
    }

    // now save work data to text file


    var taxi = window.location.search.substring(1);

    if (taxi == user.lg) {

        var j = JSON.stringify(select_pdf.save_raws);

        loadXMLDoc('scripts/up_data.php', function() {

            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {

                    //console.log(xmlhttp.responseText);

                } else {

                    console.log('save_raws shit happens, sorry!');

                }
            }

        }, 'path=presets/data_' + d2 + '_' + d1 + '&suf=txt&newtext=' + encodeURIComponent(j));


        //    } else {
        //        console.log('not matching, so no saving');
    }


};

var assignGit = function(git_obj) {

    var els = document.getElementsByClassName('fa-github');

    for (var i = 0; i < els.length; i++) {

        var f = (els[i].parentNode.parentNode.children[1].innerHTML.length < 3) ? '0' + els[i].parentNode.parentNode.children[1].innerHTML : els[i].parentNode.parentNode.children[1].innerHTML;

        var m = today[2] + 1;

        var m = (m < 10) ? '0' + m : m;

        f = today[3] + '-' + m + '-' + f.slice(0, 2);

        if (typeof git_obj[f] === 'string') {
            els[i].ih = git_obj[f];
            els[i].classList.add('vis_in');
            els[i].style.cursor = 'pointer';
            els[i].addEventListener('mouseover', function() {
                document.getElementById('git_display').innerHTML = this.ih;
                document.getElementById('git_display').style.top = window.innerHeight / 2 - document.getElementById('git_display').offsetHeight / 2 + 'px';

                document.getElementById('git_display').classList.remove('vis_out');
                document.getElementById('git_display').classList.add('vis_in');

            }, false);
            els[i].addEventListener('mouseout', function() {

                document.getElementById('git_display').classList.remove('vis_in');
                document.getElementById('git_display').classList.add('vis_out');

            }, false);
        }

    }
};

var repo = 'palm_dev';

var get_git = function() {

    loadXMLDoc('https://api.github.com/repos/botsi/' + repo + '/events?per_page=100', function() {

        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {

                var git_arr = JSON.parse(xmlhttp.responseText);

                var my_commits = {};

                var last_time = '';

                for (var i = 0; i < git_arr.length; i++) {

                    if (Array.isArray(git_arr[i].payload.commits)) {

                        var log = git_arr[i].payload.commits[0].message;

                        for (var j = 1; j < git_arr[i].payload.commits.length; j++) {

                            log += ', ' + git_arr[i].payload.commits[j].message;

                        }

                        if (last_time == git_arr[i].created_at.slice(0, 10)) {
                            my_commits[last_time] += '<br/>' + log;
                        } else {

                            var key = git_arr[i].created_at.slice(0, 10);

                            my_commits[key] = log;

                        }

                        last_time = git_arr[i].created_at.slice(0, 10);

                    }

                }

                //		now assign the shit to my work	----------

                assignGit(my_commits);

                //		end assign											----------

            } else {
                alert('git shit happens');
            }
        }
    });

};


document.addEventListener('DOMContentLoaded', set_timespan, false);
