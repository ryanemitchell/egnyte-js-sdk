var ImInBrowser = (typeof window !== "undefined");

if (!ImInBrowser) {
    var fs = require('fs');
    var stream = require('stream');
    Egnyte = require("../src/slim");
    require("./conf/apiaccess");
    require("./helpers/matchers");

    process.setMaxListeners(0);
}

describe("Storage API facade integration", function () {

    //our main testsubject
    var eg = Egnyte.init(egnyteDomain, {
        token: APIToken,
        oldIEForwarder: true, //opt in for IE8/9 support
        QPS: 2
    });


    if (ImInBrowser) {
        if (!window.egnyteDomain || !window.APIToken) {
            throw new Error("spec/conf/apiaccess.js is missing");
        }
    } else {
        if (!egnyteDomain || !APIToken) {
            throw new Error("spec/conf/apiaccess.js is missing");
        }
    }

    beforeEach(function () {
        jasmine.getEnv().defaultTimeoutInterval = 20000; //QA API can be laggy
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000; //QA API can be laggy
    });



    var testpath;


    describe("Chunked file upload", function () {

        it("Needs a location to upload to", function (done) {
            eg.API.storage.get("/Private")
                .then(function (e) {
                    expect(e["folders"]).toBeDefined();
                    //this test suite has unicorns and bacon, it can't get any better/
                    testpath = e.folders[0].path + "/bacon" + ~~(10000 * Math.random());
                    done();
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });
        });



        it("Can store a file", function (done) {
            var fileID;
            eg.API.storage.startChunkedUpload(testpath, "[chunk 1 content]", "text/plain")
                .then(function (chunked) {

                    chunked.sendChunk("[chunk 2 content]", 2); //number is optional
                    chunked.sendChunk("[chunk 3 content]", 3);

                    return chunked.sendLastChunk("[chunk 4 content]").then(function (result) {
                        fileID = result.id;
                    })

                })
                .then(function () {
                    return eg.API.storage.get(testpath);
                })
                .then(function (e) {
                    expect(e["entry_id"]).toEqual(fileID);
                    expect(+e["size"]).toBeGreaterThan(0);
                    return eg.API.storage.download(testpath, null, false /*non binary*/ )
                })
                .then(function (xhr) {
                    expect(xhr.body).toEqual("[chunk 1 content][chunk 2 content][chunk 3 content][chunk 4 content]");

                    return eg.API.storage.remove(testpath).then(function () {
                        done();
                    })
                }).fail(function (e) {
                    expect(this).toAutoFail(e);
                    done();
                });

        });


        if (!ImInBrowser) {
            it("Can store a file stream", function (done) {
                var st = fs.createReadStream(__dirname + '/file.png');
                eg.API.storage.streamToChunks(testpath, st, "image/png")
                    .then(function (result) {
                        expect(result.id).toBeDefined();
                        done();
                    });

            });

            it("Can store a file stream htat is smaller than 1 chunk", function (done) {
                var st = new stream.Readable();
                st.push("Tradition enforces enforcing tradidion");
                st.push(null);
                eg.API.storage.streamToChunks(testpath, st, "text/plain")
                    .then(function (result) {
                        expect(result.id).toBeDefined();
                        done();
                    });

            });
        }



    });


});