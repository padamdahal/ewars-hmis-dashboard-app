// Get the app manifest in order to determine the location of the API
$.getJSON('manifest.webapp').done(manifest => {
    console.info('Loading app resources');
    var apiBase = manifest.activities.dhis.href + '/';
    var appKey = window.location.href.substr(apiBase.length + 6);
    appKey = appKey.substr(0, appKey.indexOf('/'));
	
	// EWARS portal URL - Update when necessary
	var portalUrl = "https://myehr.dns-cloud.net/index.html"; // to display when accessed directly
	var portalUrlDashboard = "https://myehr.dns-cloud.net/hmis-dashboard.html"; // to display when accessed from dashboard
	
    // Get the dashboardItemId query parameter from the URL
    var dashboardItemId = (/[?&]dashboardItemId=([a-zA-Z0-9]{11})(?:&|$)/g.exec(window.location.search) || [undefined]).pop();
	
    if (!dashboardItemId) {
		// Not accessed from DHIS2 Dashboard, display EWARS public portal
		$("#src").attr("src", portalUrl);
    }else{
		// Access the users orgunit and pass it along with EWARS portal url
		var userInfoUrl = apiBase+"api/me/organisationUnits";
		$.getJSON(userInfoUrl).done(userInfo => {
			var ewarsPortalUrl = portalUrlDashboard+"?ouLevel="+userInfo[0].level+"&ouName="+userInfo[0].name+"&ouId="+userInfo[0].id;
			$("#src").attr("src", ewarsPortalUrl);
		}).fail(error => {
			console.warn('Failed to get userInfo:', error);
		});
    }
}).fail(error => {
	console.warn('Failed to get manifest:', error);
});