const str1 = 'SZ128122,SZ128070,SZ128111,SZ128101,SH113582,SH113643,SH113016,SZ127057,SZ123027,SH113618,SH113620,SZ123140,SH113621,SZ123013,SZ123031,SZ123137,SZ123123,SZ123149,SZ123148,SZ123138,SZ123073,SZ123070,SZ123035';
const str2 = 'SZ127065,SZ127048,SZ127036,SZ128079,SZ123067,SZ127037,SZ123057,SZ123070,SZ128101,SZ123084,SZ123061,SZ123121,SZ128087,SH113537,SH113630,SZ128141,SH113548,SZ127058,SH113502,SZ127030,SH113567,SH111004,SZ123088,SZ128075,SZ128056,SZ123112,SZ123114,SZ128109,SZ123140,SZ127059';
const str3 = 'SZ123092,SZ128023,SH113582,SZ123011,SZ127064,SZ123075,SZ123137,SZ123127,SZ123144,SZ123148,SZ123083,SZ127035,SH113626,SZ123120,SH113637,SZ128053,SZ123044,SH113598,SZ127019,SZ123080,SH118008,SZ123060,SZ123013,SH113566,SH110084,SH113025,SZ123097,SZ128039,SZ123045,SZ128143';
const str4 = 'SZ127052,SZ123105,SH118009,SZ128076,SH113619,SZ123118,SZ123023,SZ123109,SZ128120,SZ123014,SH113649,SH113600,SH110082,SZ123110,SZ123101,SH113622,SZ127027,SH118006,SH110085,SZ128062,SH113642,SZ128070,SZ123018,SH113615,SH113634,SH113631,SH113628,SZ123090,SH118000,SZ127031';
const str5 = 'SZ123039,SZ128131,SH110063,SZ123087,SZ128041,SZ123089,SH113027,SH113053,SH113577,SH113045,SH110052,SZ128095,SZ128083,SZ123139,SZ123065,SZ127041,SZ123125,SH113030,SZ123025,SZ123135,SZ123048,SZ123093,SZ127026,SZ128049,SZ123052,SZ123077,SH113632,SH113597,SH113561,SH113591';
const str6 = 'SH113532,SZ127016,SZ123126,SZ127053,SZ128073,SZ128021,SZ128142,SZ123085,SH113620,SH113549,SH110068,SZ128145,SH118005,SZ123072,SZ128091,SZ123100,SH113594,SZ127033,SZ123103,SZ123129,SH113638,SH113593,SH113505,SH113647,SH113570,SH113051,SH113609,SH110048,SH113545,SH113504';
// const str7 = ;
// const str8 = ;
// const str9 = ;
// const str10 = ;
// const str11 = ;
// const str12 = ;
// const str13 = ;
// const str14 = ;
// const str15 = ;

const list = [
  ...str1.split(','),
  ...str2.split(','),
  ...str3.split(','),
  ...str4.split(','),
  ...str5.split(','),
  ...str6.split(','),
];
const filterList = list.map(ele => ele.toLowerCase());

exports = module.exports = filterList;