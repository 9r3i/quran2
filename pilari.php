<?php
header('content-type: application/json');
$json_dir = 'json/';
$sdir = @scandir($json_dir);
$hasil = array();
$index = json_decode(@file_get_contents($json_dir.'index.js'),true);
$newin = array();
foreach($index as $in){
  $newin[str_replace('&apos;','\'',$in['name'])] = $in['number'];
}

if(isset($_GET['kata'])&&array_key_exists(htmlspecialchars($_GET['kata']),$newin)){
  //$hasil = @file_get_contents($json_dir.$newin[$_GET['kata']].'.js');
  $hasil['data'] = $newin[$_GET['kata']];
  echo json_encode($hasil);
  exit;
}

elseif(isset($_GET['kata'])&&$_GET['kata']!==''&&isset($_GET['locale'])&&$_GET['locale']!==''){
  $kata = preg_replace('/[^a-zA-Z0-9\s-]+/i','',$_GET['kata']);
  $locale = str_replace('locale_','',$_GET['locale']);
  $ros=0;
  foreach($sdir as $jfile){
    $content = @file_get_contents($json_dir.$jfile);
    if(preg_match('/'.$kata.'/i',$content,$akurs)){
	  $json = json_decode($content,true);
	  $ri=0;
	  if(isset($json['ayat'])){
	    $ayat = $json['ayat'];
	    foreach($ayat as $son){
	      $ri++;
	      if(preg_match('/'.$kata.'/i',$son[$locale],$akur)){
		    $hasil[$json['name']][$ri] = str_replace($akur[0],'<strong>'.$akur[0].'</strong>',$son[$locale]);
	        $ros++;
		  }
	    }
	  }
	}
  }
  if($ros==0){
    $hasil['error'] = '602';
	$hasil['message'] = 'Cannot find: '.$_GET['kata'];
  }
  echo json_encode($hasil);
}
else{
  $hasil['error'] = (!isset($_GET['locale'])||$_GET['locale']=='')?'600':'601';
  $hasil['message'] = (!isset($_GET['locale'])||$_GET['locale']=='')?'Please set your locale':'Please type your word';
  echo json_encode($hasil);
}
