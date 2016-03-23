/*
 *  Al Qur'an
 *  quran.js created by Luthfie
 */
(function(){
var source = 'json/';
var locale = {"locale_english":"English","locale_indonesian":"Indonesian","locale_japanese":"Japanese","locale_korean":"Korean","locale_chinese":"Chinese","locale_tafsir":"Tafsir","locale_russian":"Rusian","locale_spanish":"Spanish","locale_french":"French"};
$('body').html('<div id="index"><div class="daftar-selector"><div id="title"></div><select id="daftar_suroh"></select><select id="daftar_locale"></select><div id="cari"></div></div><div class="isi-suroh"></div><div id="scroller">^</div><div id="kaki"></div></div>');
$("#cari").html('<div id="loader"></div><input type="text" value="Search..." id="milari" onfocus="if(this.value==\'Search...\') this.value=\'\';" onblur="if(this.value==\'\') this.value=\'Search...\';" list="cariin" />');
$.getJSON(source+"index.js",function(index){
  $("#daftar_suroh").html('<option value="">-- Select a Suroh --</option>');
  $("#cari").append('<datalist id="cariin"></div>');
  for(key in index){
    $("#cariin").append('<option value="'+index[key].name+'">');
    $("#daftar_suroh").append('<option value="'+index[key].number+'">'+index[key].number+'. '+index[key].name+'</option>');
  }
  $.getJSON(source+"title.js",function(title){
    $("#title").html(title.title);
  });
});
$("#daftar_locale").append('<option value="">-- Locale --</option>');
for(key in locale){
  $("#daftar_locale").append('<option value="'+key+'">'+locale[key]+'</option>');
}
var title = 'Al Qur\'an | Presented by Luthfie';
$("title").text(title);
$("select#daftar_suroh").change(function(){
  var val = $(this).val();
  load_suroh(val);
});
$("#kaki").html('Presented by Luthfie');
$("#daftar_locale").change(function(){
  var val_locale = $(this).val();
  set_locale(locale,val_locale);
});
$(window).scroll(function(){
  if($(this).scrollTop()>1){
    $("#scroller").fadeIn(500);
  }else{
    $("#scroller").fadeOut(500);
  }
});
$("#scroller").click(function(){
  resetScroller("index");
});
$("#milari").on("keyup",function(tombol){
  var str = $(this).val();
  var lcl = $("#daftar_locale").val();
  var wilo = window.location.href;
  if(tombol.which==13){
    $(this).hide(500);
	$("#loader").show(500);
	if(!wilo.match(/http/gi)){
	  $(".isi-suroh").html('<div id="hasil_error">You need an Apache to run this search.</div>');
	  $("#loader").hide(500);
      $("#milari").show(500);
	  return;
	}
	$.get('pilari.php?kata='+str+'&locale='+lcl,function(hasil){
	  $("#loader").hide(500);
      $("#milari").show(500);
	  if(hasil.error!==undefined){
	    $(".isi-suroh").html('<div id="hasil_error">'+hasil.message+'</div>');
	  }
	  else if(hasil.data!==undefined){
		load_suroh(hasil.data);
	  }
	  else{
	    $(".isi-suroh").html('<div id="hasil"></div>');
		for(suroh in hasil){
		  for(ayat in hasil[suroh]){
	        $("#hasil").append('<div class="hasil-each" id="hasil_each_'+ayat+'">'+suroh+': '+hasil[suroh][ayat]+'</div>');
		  }
		}
	  }
	});
  }
});
function set_locale(locale,one){
  one = (one==undefined)?'locale_arabic':one;
  $("div.each-locale").hide();
  $("div#locale_arabic").show();
  $("div#"+one).show();
}

function load_suroh(val){
  $(".isi-suroh").html('<div id="suroh_name"></div><div id="ayat"></div>');
  $.getJSON('json/'+val+".js",function(suroh){
    $("title").text(dss(suroh.name)+" | "+title);
    $("#suroh_name").html(suroh.name);
	if(suroh.taud!==undefined){
	  $("#ayat").append('<div class="ayat-each" id="taud">'+suroh.taud+'</div>');
	}
	if(suroh.bismillah!==undefined){
	  $("#ayat").append('<div class="ayat-each" id="bismillah">'+suroh.bismillah+'</div>');
	}
	for(var i=0;i<suroh.ayat.length;i++){
	  $("#ayat").append('<div class="ayat-each" id="ayat_each_'+i+'"></div>');
	  for(key in suroh.ayat[i]){
	    $("#ayat_each_"+i).append('<div class="each-locale" id="locale_'+key+'">'+suroh.ayat[i][key]+'</div>');
	  }
	}
	var val_locale = $("#daftar_locale").val();
	set_locale(locale,val_locale);
  });
}

})();


var scrollY = 0;
var distance = 93;
var speed = 7;
function autoScrollTo(el){
  var currentY = window.pageYOffset;
  var targetY = document.getElementById(el).offsetTop;
  var bodyHeight = document.body.offsetHeight;
  var yPos = currentY + window.innerHeight;
  var animator = setTimeout('autoScrollTo(\''+el+'\')',24);
  if(yPos>bodyHeight){
    clearTimeout(animator);
  }else{
    if(currentY < targetY-distance){
       scrollY = currentY+distance;
       window.scroll(0, scrollY);
    }else{
      clearTimeout(animator);
    }
  }
}
function resetScroller(el){
  var currentY = window.pageYOffset;
  var targetY = document.getElementById(el).offsetTop;
  var animator = setTimeout('resetScroller(\''+el+'\')',speed);
  if(currentY > targetY){
    scrollY = currentY-distance;
    window.scroll(0, scrollY);
  }else{
    clearTimeout(animator);
  }
}

function ent_decode(str){
  var ent = str.replace('/[\u00A0-\u9999<>\&]/gim',function(i){
    return '&#'+i.charCodeAt(0)+';';
  });
}

function dss(str){
  return str.replace(/&apos;/gi,'\'');
}
