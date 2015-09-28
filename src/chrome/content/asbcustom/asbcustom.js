const abFields = new Array(
  new Array("FirstName", "LastName", "DisplayName"),
  new Array("PrimaryEmail"  ),
  new Array("_AimScreenName"),
  new Array("Company"       ),
  new Array("NickName"      ),
  new Array("SecondEmail"   ),
  new Array("Department"    ),
  new Array("JobTitle"      ),
  new Array("CellularNumber"),
  new Array("PagerNumber"   ),
  new Array("FaxNumber"     ),
  new Array("HomePhone"     ),
  new Array("WorkPhone"     )
);

var gSearchRange = new Array(
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false
);

function initCustom() {
  var tree = document.getElementById("abResultsTree");
  var treecols = tree.childNodes[0];
  addField(treecols);
  
  nsPreferences.setUnicharPref("ldap_2.servers.default.attrmap.Department", "ou,department,departmentnumber,orgunit");
}

function addField(treecols) {
  var field = new Array(
    new Array("_AimScreenName", gLocalString._AimScreenName),
    new Array("Company"       , gLocalString.Company       ),
    new Array("NickName"      , gLocalString.NickName      ),
    new Array("SecondEmail"   , gLocalString.SecondEmail   ),
    new Array("Department"    , gLocalString.Department    ),
    new Array("JobTitle"      , gLocalString.JobTitle      ),
    new Array("CellularNumber", gLocalString.CellularNumber),
    new Array("PagerNumber"   , gLocalString.PagerNumber   ),
    new Array("FaxNumber"     , gLocalString.FaxNumber     ),
    new Array("HomePhone"     , gLocalString.HomePhone     ),
    new Array("WorkPhone"     , gLocalString.WorkPhone     )
  );
  const F_ID    = 0;
  const F_LABEL = 1;
  
  for (var i = 0; i < field.length; i++) {
    var splitter = document.createElement("splitter");
    splitter.setAttribute("class", "tree-splitter");
    
    var treecol = document.createElement("treecol");
    treecol.setAttribute("id"     , field[i][F_ID]                      );
    treecol.setAttribute("class"  , "sortDirectionIndicator"            );
    treecol.setAttribute("persist", "hidden ordinal width sortDirection");
    treecol.setAttribute("hidden" , "true"                              );
    treecol.setAttribute("flex"   , "1"                                 );
    treecol.setAttribute("label"  , field[i][F_LABEL]                   );
    
    treecols.appendChild(splitter);
    treecols.appendChild(treecol);
  }
}

function AddressBookMenuListChange_2nd()
{
  var gSearchInput = document.getElementById("peopleSearchInput");
  if (!gSearchInput.showingSearchCriteria) 
    onEnterInSearchBar_2nd();
  else 
    ChangeDirectoryByURI(document.getElementById('addressbookList').value);
}


function onEnterInSearchBar_2nd() {
  // original
  //onEnterInSearchBar();
  
  var searchURI = GetSelectedDirectory();
  if (!searchURI) return;
  
  var gSearchInput = document.getElementById("peopleSearchInput");
  var searchTerm = gSearchInput.value;

  // When switching TO an LDAP directory, use a default 
  // search term so no empty list appears
  var gDefaultSearch = "*";
  if ( isLdapDirectory(searchURI) && !isValidSearchQuery() )
    searchTerm = gDefaultSearch;

  if (isValidSearchQuery() || searchTerm == gDefaultSearch) {
    var defaultSearchMode = 0;
    searchURI += buildSearchQuery(searchTerm, defaultSearchMode);
    //searchURI += buildSearchQuery(searchTerm, gSearchInput.searchMode);
  }

  SetAbView(searchURI);
}

const searchModes = new Array("c", "bw", "ew", "=");

function buildSearchQuery(searchString, searchMode)
{
  /* Token   Condition
   *  =       Is
   *  !=      Is Not
   *  lt      Less Than
   *  gt      Greater Than
   *  bw      Begins With
   *  ew      Ends With
   *  c       Contains
   *  !c      Does Not Contain
   *
   * see nsAbQueryStringToExpression::CreateBooleanConditionString in
   * ./mailnews/addrbook/src/nsAbQueryStringToExpression.cpp
   */
  var result = "";
  var searchTerms = searchString.split(" ");
  
  var count = 0;
  for (var i=0; i<searchTerms.length; i++)
  {
    if (searchTerms[i] != "")
    {
      count++;
      var condition = searchModes[searchMode];
      // When using wildcard search (*), always use the condition "="
      if ( searchTerms[i] == "*" )
        condition = searchModes[3];
      result += getSubQuery(condition, encodeURIComponent(searchTerms[i]));
    }
  }

  if (count > 1)
    result = "?(and" + result + ")";
  else
    result = "?" + result;

  return result;
}

function loadSearchRange() {
  var fieldPrefName = new Array(
    "asbcustom.search_generated_name"  ,
    "asbcustom.search_primary_email"   ,
    "asbcustom.search__aim_screen_name",
    "asbcustom.search_company"         ,
    "asbcustom.search_nick_name"       ,
    "asbcustom.search_second_email"    ,
    "asbcustom.search_department"      ,
    "asbcustom.search_job_title"       ,
    "asbcustom.search_cellular_number" ,
    "asbcustom.search_pager_number"    ,
    "asbcustom.search_fax_number"      ,
    "asbcustom.search_home_phone"      ,
    "asbcustom.search_work_phone"
  );
  
  for (var i = 0; i < fieldPrefName.length; i++) {
    gSearchRange[i]   = nsPreferences.getBoolPref(fieldPrefName[i], true);
  }
}

/*
 * query format: "(or(DisplayName,@C,@V)(FirstName,@C,@V)(LastName,@C,@V))"
 */
function getSubQuery(condition, value)
{
  loadSearchRange();
  
  var result = "(or";

  for (var i=0; i<abFields.length; i++)
  {
    if (gSearchRange[i])
      for (var j=0; j<abFields[i].length; j++)
      {
        result += "(" + abFields[i][j] + "," + condition + "," + value + ")";
      }
  }

  result += ")";
  
  return result;
}

function isValidSearchQuery()
{
  var gSearchInput = document.getElementById("peopleSearchInput");
  return ( !(gSearchInput.value == "" || gSearchInput.showingSearchCriteria) );
}

function isLdapDirectory(uri)
{
  var ldapUrlPrefix = "moz-abldapdirectory://";
  var result = ((uri.indexOf(ldapUrlPrefix, 0)) == 0)
  
  return result;
}

initCustom();
