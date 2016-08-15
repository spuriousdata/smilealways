var spoofRequest = function(spoofUrl) {
    return {
        url: spoofUrl
    }
};

var testHelper = function(inputUrl, expRes, testMsg) {
    // make sure detectRedirect performs properly
    var req = spoofRequest(inputUrl);
    var res = detectRedirect(req);
    // if we didn't get a redirect then set it to the same url for testing
    if (!res) {
        res = {
            redirectUrl: inputUrl
        };
    }
	equal(res.redirectUrl, expRes, testMsg);
    // make the actual amazon request and make sure things work
};

var makeRequest = function(url) {
    $.get(
        url,
        {paramOne : 1, paramX : 'abc'},
        function(data) {
            console.log('page content: ' + data);
        }
     );
};

test("testing detectRedirect", function() {
    var saTag = "sa-no-redirect=1";
    testHelper("http://www.amazon.com", "http://smile.amazon.com?" + saTag, "test basic http request");
    testHelper("https://www.amazon.com", "https://smile.amazon.com?" + saTag, "test basic https request");

    // Affiliate Programs
    testHelper("http://www.amazon.com/Samsung-Fitness-Tracker-Smartwatch-Warranty/dp/B00JBJ3JBI/?t=slicinc-20&tag=slicinc-20&ascsubtag=b8845bf585ad460b9e8d6a7891446fb7", 
        "http://smile.amazon.com/Samsung-Fitness-Tracker-Smartwatch-Warranty/dp/B00JBJ3JBI/?t=slicinc-20&tag=slicinc-20&ascsubtag=b8845bf585ad460b9e8d6a7891446fb7&" + saTag,
        "test affiliate link 1");

    testHelper("http://www.amazon.com/gp/product/B008Z1IAB2/ref=pe_820770_118255880_em_1p_0_ti", 
        "http://smile.amazon.com/gp/product/B008Z1IAB2/ref=pe_820770_118255880_em_1p_0_ti?" + saTag,
        "test affiliate link 2");

    // Reviews
    testHelper("http://www.amazon.com/review/R27KDST5CWRJFZ/ref=cm_cr_quotes_dprb_1?ie=UTF8&ASIN=B00JBJ3JBI&nodeID=2335752011&store=wireless",
       "http://smile.amazon.com/review/R27KDST5CWRJFZ/ref=cm_cr_quotes_dprb_1?ie=UTF8&ASIN=B00JBJ3JBI&nodeID=2335752011&store=wireless&" + saTag,
       "test review link");

    // Email links -- should not redirect
    testHelper("http://www.amazon.com/gp/r.html?R=31397EMN4EI6D&C=1WC8X72NNSJIY&H=UJLQOSJUR5AAM1BEA3SCZ9UDLHWA&T=C&U=http%3A%2F%2Fwww.amazon.com%2Fb%2Fref%3Dpe_854610_117920160_amzn_student_wlcmml_menuitem1%3Fie%3DUTF8%26node%3D668781011", 
        "http://www.amazon.com/gp/r.html?R=31397EMN4EI6D&C=1WC8X72NNSJIY&H=UJLQOSJUR5AAM1BEA3SCZ9UDLHWA&T=C&U=http%3A%2F%2Fwww.amazon.com%2Fb%2Fref%3Dpe_854610_117920160_amzn_student_wlcmml_menuitem1%3Fie%3DUTF8%26node%3D668781011",
        "test email link 1");
    testHelper("http://www.amazon.com/gp/r.html?R=31397EMN4EI6D&C=1WC8X72NNSJIY&H=EZ9XEOWKFVAPN3ETNHTGAHHUVACA&T=C&U=http%3A%2F%2Fwww.amazon.com%2Fb%2Fref%3Dpe_854610_117920160_amzn_student_wlcmml_menuitem2%3Fie%3DUTF8%26node%3D465600",
            "http://www.amazon.com/gp/r.html?R=31397EMN4EI6D&C=1WC8X72NNSJIY&H=EZ9XEOWKFVAPN3ETNHTGAHHUVACA&T=C&U=http%3A%2F%2Fwww.amazon.com%2Fb%2Fref%3Dpe_854610_117920160_amzn_student_wlcmml_menuitem2%3Fie%3DUTF8%26node%3D465600",
            "test email link 2");


    // Amazon Services - should not redirect
    testHelper("http://aws.amazon.com", "http://aws.amazon.com", "test aws");
    testHelper("http://www.amazon.com/gp/dmusic/cloudplayer/web?ie=UTF8&*Version*=1&*entries*=0#albums",
               "http://www.amazon.com/gp/dmusic/cloudplayer/web?ie=UTF8&*Version*=1&*entries*=0#albums",
               "test cloud player");
    testHelper("http://read.amazon.com", "http://read.amazon.com", "test reader");

});
