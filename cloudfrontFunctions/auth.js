function handler(event) {
    var authHeaders = event.request.headers.authorization;
    //https://gist.github.com/oeon/0ada0457194ebf70ec2428900ba76255
    function b2a(a) {
      var c, d, e, f, g, h, i, j, o, b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", k = 0, l = 0, m = "", n = [];
      if (!a) return a;
      do c = a.charCodeAt(k++), d = a.charCodeAt(k++), e = a.charCodeAt(k++), j = c << 16 | d << 8 | e, 
      f = 63 & j >> 18, g = 63 & j >> 12, h = 63 & j >> 6, i = 63 & j, n[l++] = b.charAt(f) + b.charAt(g) + b.charAt(h) + b.charAt(i); while (k < a.length);
      return m = n.join(""), o = a.length % 3, (o ? m.slice(0, o - 3) :m) + "===".slice(o || 3);
    }

    // The Base64-encoded Auth string that should be present.
    // It is an encoding of `Basic base64([username]:[password])`
    // The username and password are:
    //      Username: john
    //      Password: foobar
    // var expected = "Basic am9objpmb29iYXI=";
    var concat = "${UserName}:${Password}"
    var encode = b2a(concat)
    var expected = "Basic " + encode
    // If an Authorization header is supplied and it's an exact match, pass the
    // request on through to CF/the origin without any modification.
    if (authHeaders && authHeaders.value === expected) {
      return event.request;
    } else if (authHeaders && authHeaders.value !== expected) {
      console.log("expected value: ", authHeaders.value, "supplied value: ", expected)
    }
    // But if we get here, we must either be missing the auth header or the
    // credentials failed to match what we expected.
    // Request the browser present the Basic Auth dialog.
    var response = {
      statusCode: 401,
      statusDescription: "Unauthorized",
      headers: {
        "www-authenticate": {
          value: 'Basic realm="Enter credentials for this super secure site"',
        },
      },
    };
  
    return response;
  }