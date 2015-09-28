function asbcustomInputHelperCommand(event) {
  var peopleSearchInput = document.getElementById("peopleSearchInput");
  peopleSearchInput.value = event.label + " ";
  peopleSearchInput.focus();
  //gContentChanged=true;
  //SetComposeWindowTitle();
}

function load_search_input_menu(menupopup) {
  //if (0 < menupopup.childNodes.length)
  while(menupopup.firstChild){
    menupopup.removeChild(menupopup.firstChild);
  }

  var keywords = new Array();
  var keywords_num = nsPreferences.getIntPref("asbcustom_input_helper.searchWord.num", 0);
  for (var i = 0; i < keywords_num; i++) {
    var prefvalue = nsPreferences.copyUnicharPref("asbcustom_input_helper.searchWord" + i);
    if (prefvalue != "")
      keywords.push(prefvalue);
  }

  //var keywords = new Array("Ｆ営１", "ＦＩ１");
  
  for (var i = 0; i < keywords.length; i++) {
    var menuitem = document.createElement("menuitem");
    menuitem.setAttribute("label", keywords[i]);
    menuitem.setAttribute("oncommand", "asbcustomInputHelperCommand(this);")

    menupopup.appendChild(menuitem);
  }
  
}

