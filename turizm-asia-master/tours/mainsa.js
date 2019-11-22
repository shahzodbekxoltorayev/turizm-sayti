var $bm = function() {
    var nativeEvents = ["change", "click", "mouseover", "mouseout", "keydown", "load", "keyup", "mousemove", "touchmove", "scroll", "ontouchstart"],
        customEvents = [],
        loadedJSLists = [],
        loadedCSSLists = [];
    var cancelxmlHttp = new XMLHttpRequest;
    var Constructor = function(selector) {
        if (selector === "document") {
            this.elems = [document]
        } else if (selector === "window") {
            this.elems = [window]
        } else {
            this.elems = document.querySelectorAll(selector)
        }
    };
    var instantiate = function(selector) {
        return new Constructor(selector)
    };
    Constructor.prototype.each = function(callback) {
        if (!callback || typeof callback !== "function") return;
        for (var i = 0; i < this.elems.length; i++) {
            callback(this.elems[i], i)
        }
        return this
    };
    Constructor.prototype.postAjax = function(url, data, success, content_type) {
        var content_type = typeof content_type != "undefined" ? content_type : "application/x-www-form-urlencoded";
        var params = typeof data != "object" ? data : Object.keys(data).map(function(k) {
            return encodeURIComponent(k) + "=" + encodeURIComponent(data[k])
        }).join("&");
        if (content_type == "application/json;charset=UTF-8") {
            params = JSON.stringify(data)
        }
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open("POST", url);
        xhr.onreadystatechange = function() {
            if (xhr.readyState > 3 && xhr.status == 200) {
                success(xhr.responseText)
            }
        };
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.setRequestHeader("Content-Type", content_type);
        xhr.send(params);
        return xhr
    };
    Constructor.prototype.addListener = function(type, func) {
        type = type == "touchmove" && !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform) ? "scroll" : type;
        if (nativeEvents.indexOf(type) > -1) {
            this.each(function(item) {
                item.addEventListener(type, func, false)
            })
        }
        return this
    };
    Constructor.prototype.removeListener = function(type, func) {
        if (nativeEvents.indexOf(type) > -1) {
            this.each(function(item) {
                item.removeEventListener(type, func, false)
            })
        }
        return this
    };
    Constructor.prototype.injectDOM = function() {
        try {
            var attribute = arguments[0];
            var dom = arguments[1];
            var type = !!arguments[2] ? arguments[2] : "replace";
            var domView = document.querySelector(attribute);
            if (domView) {
                type == "append" ? domView.innerHTML += domView ? dom : "" : domView.innerHTML = domView ? dom : ""
            }
        } catch (e) {
            throw e
        }
        return this
    };
    Constructor.prototype.get = function(url, callback) {
        return httpGetAsync(url, callback);

        function httpGetAsync(url, callback) {
            var xmlHttp = new XMLHttpRequest;
            xmlHttp.onreadystatechange = function() {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) callback(xmlHttp.responseText)
            };
            xmlHttp.open("GET", url, true);
            xmlHttp.send(null)
        }
    };
    Constructor.prototype.cancellerableget = function(url, callback) {
        return httpGetAsync(url, callback);

        function httpGetAsync(url, callback) {
            if (cancelxmlHttp && cancelxmlHttp.readystate != 4) {
                cancelxmlHttp.abort()
            }
            cancelxmlHttp.onreadystatechange = function() {
                if (cancelxmlHttp.readyState == 4 && cancelxmlHttp.status == 200) callback(cancelxmlHttp.responseText)
            };
            cancelxmlHttp.open("GET", url, true);
            cancelxmlHttp.send(null)
        }
    };
    Constructor.prototype.getInjectDOM = function() {
        try {
            var self = this;
            var url = arguments[0];
            var attribute = arguments[1];
            var domtype = arguments[2] || null;
            var callback = arguments[3] || undefined;
            var canceller = arguments[4] || false;
            canceller ? this.cancellerableget(url, function(res) {
                self.injectDOM(attribute, res, domtype);
                !!callback && callback(res)
            }) : this.get(url, function(res) {
                self.injectDOM(attribute, res, domtype);
                !!callback && callback(res)
            })
        } catch (e) {
            throw e
        }
    };
    Constructor.prototype.loadJS = function(source, callback) {
        try {
            if (loadedJSLists.indexOf(source) > -1) return callback();
            var script = document.createElement("script");
            var prior = document.getElementsByTagName("script")[0];
            script.async = 1;
            script.onload = script.onreadystatechange = function(_, isAbort) {
                if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
                    script.onload = script.onreadystatechange = null;
                    script = undefined;
                    if (!isAbort && callback) {
                        loadedJSLists.push(source);
                        setTimeout(callback, 0)
                    }
                }
            };
            script.src = source;
            prior.parentNode.insertBefore(script, prior)
        } catch (e) {
            throw e
        }
    };
    Constructor.prototype.loadCSS = function(path, callback) {
        try {
            if (loadedCSSLists.indexOf(path) > -1) return callback();
            var head = document.getElementsByTagName("head")[0],
                link = document.createElement("link");
            link.setAttribute("href", path);
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("type", "text/css");
            var sheet, cssRules;
            if ("sheet" in link) {
                sheet = "sheet";
                cssRules = "cssRules"
            } else {
                sheet = "styleSheet";
                cssRules = "rules"
            }
            head.appendChild(link);
            loadedCSSLists.push(path);
            callback()
        } catch (e) {
            throw e
        }
    };
    Constructor.prototype.getInputValue = function() {
        var values = [];
        this.each(function(item) {
            values.push(item.value)
        });
        return values
    };
    Constructor.prototype.removeClass = function(str) {
        this.each(function(item) {
            str ? item.classList.remove(str) : item.className = ""
        })
    };
    Constructor.prototype.addClass = function(str) {
        this.each(function(item) {
            item.classList.add(str)
        })
    };
    Constructor.prototype.toggleClass = function(str) {
        this.each(function(item) {
            item.classList.toggle(str)
        })
    };
    Constructor.prototype.removeDOM = function() {
        this.each(function(item) {
            item.remove()
        })
    };
    Constructor.prototype.focus = function() {
        this.each(function(item) {
            item.focus()
        })
    };
    Constructor.prototype.isInViewport = function(callback) {
        this.each(function(item) {
            callback(helpers("viewport", item))
        })
    };
    Constructor.prototype.isInViewportWithEvent = function(callback) {
        this.each(function(item) {
            callback(helpers("viewport", item), item)
        })
    };
    Constructor.prototype.showDOM = function() {
        this.each(function(item) {
            item.style.display = "block"
        })
    };
    Constructor.prototype.hideDOM = function() {
        this.each(function(item) {
            item.style.display = "none"
        })
    };
    Constructor.prototype.toggleDom = function() {
        this.each(function(item) {
            item.style.display = item.style.display == "block" ? "none" : "block"
        })
    };
    Constructor.prototype.showDOMInline = function() {
        this.each(function(item) {
            item.style.display = "inline-block"
        })
    };
    Constructor.prototype.changeInnerText = function(str, supportHTML) {
        this.each(function(item) {
            if (supportHTML == true) {
                item.innerHTML = str
            } else item.innerText = str
        })
    };
    Constructor.prototype.hasClass = function(classname) {
        var hasCls = false;
        this.each(function(item) {
            hasCls = item.className.split(/\s/).indexOf(classname) >= 0
        });
        return hasCls
    };
    Constructor.prototype.setAttribute = function(attribute, value) {
        this.each(function(item) {
            item.setAttribute(attribute, value)
        })
    };
    Constructor.prototype.getDataSets = function() {
        var datasets = [];
        this.each(function(item) {
            datasets.push(Object.assign({}, item.dataset))
        });
        return datasets
    };
    Constructor.prototype.click = function() {
        this.each(function(item) {
            try {
                item.click()
            } catch (e) {
                console.log(e)
            }
        })
    };
    Constructor.prototype.children = function() {
        var res = [];
        this.each(function(item) {
            res = item.children
        });
        return res
    };
    Constructor.prototype.watch = function(object, key, callback) {
        object.watch("" + key, function(id, oldval, newval) {
            callback(id, oldval, newval)
        })
    };
    Constructor.prototype.unwatch = function(object, key) {
        object.unwatch("" + key)
    };
    var helpers = function() {
        var viewport = function(arguments) {
            try {
                var el = arguments[1];
                if (el) {
                    var top = el.offsetTop;
                    var left = el.offsetLeft;
                    var width = el.offsetWidth;
                    var height = el.offsetHeight;
                    while (el.offsetParent) {
                        el = el.offsetParent;
                        top += el.offsetTop;
                        left += el.offsetLeft
                    }
                    return top < window.pageYOffset + window.innerHeight && left < window.pageXOffset + window.innerWidth && top + height > window.pageYOffset && left + width > window.pageXOffset
                }
                return false
            } catch (e) {
                throw e
            }
        };
        try {
            return eval(arguments[0])(arguments)
        } catch (e) {
            throw e
        }
    };
    return instantiate
}();
if (!Object.prototype.watch) {
    Object.defineProperty(Object.prototype, "watch", {
        enumerable: false,
        configurable: true,
        writable: false,
        value: function(prop, handler) {
            var oldval = this[prop],
                newval = oldval,
                getter = function() {
                    return newval
                },
                setter = function(val) {
                    oldval = newval;
                    return newval = handler.call(this, prop, oldval, val)
                };
            if (delete this[prop]) {
                Object.defineProperty(this, prop, {
                    get: getter,
                    set: setter,
                    enumerable: true,
                    configurable: true
                })
            }
        }
    })
}
if (!Object.prototype.unwatch) {
    Object.defineProperty(Object.prototype, "unwatch", {
        enumerable: false,
        configurable: true,
        writable: false,
        value: function(prop) {
            var val = this[prop];
            delete this[prop];
            this[prop] = val
        }
    })
}
var BMScrollTo = {
    documentVerticalScrollPosition: function() {
        if (self.pageYOffset) return self.pageYOffset;
        if (document.documentElement && document.documentElement.scrollTop) return document.documentElement.scrollTop;
        if (document.body.scrollTop) return document.body.scrollTop;
        return 0
    },
    viewportHeight: function() {
        return document.compatMode === "CSS1Compat" ? document.documentElement.clientHeight : document.body.clientHeight
    },
    documentHeight: function() {
        return document.height !== undefined ? document.height : document.body.offsetHeight
    },
    documentMaximumScrollPosition: function() {
        return this.documentHeight() - this.viewportHeight()
    },
    elementVerticalClientPositionById: function(id) {
        var element = document.getElementById(id);
        var rectangle = element.getBoundingClientRect();
        return rectangle.top
    },
    scrollVerticalTickToPosition: function(currentPosition, targetPosition) {
        var filter = .2;
        var fps = 60;
        var difference = parseFloat(targetPosition) - parseFloat(currentPosition);
        var arrived = Math.abs(difference) <= .5;
        if (arrived) {
            scrollTo(0, targetPosition);
            return
        }
        currentPosition = parseFloat(currentPosition) * (1 - filter) + parseFloat(targetPosition) * filter;
        scrollTo(0, Math.round(currentPosition));
        setTimeout("BMScrollTo.scrollVerticalTickToPosition(" + currentPosition + ", " + targetPosition + ")", 1e3 / fps)
    },
    scrollVerticalToElementById: function(id, padding) {
        var element = document.getElementById(id);
        if (element == null) {
            console.warn("Cannot find element with id '" + id + "'.");
            return
        }
        var targetPosition = this.documentVerticalScrollPosition() + this.elementVerticalClientPositionById(id) - padding;
        var currentPosition = this.documentVerticalScrollPosition();
        var maximumScrollPosition = this.documentMaximumScrollPosition();
        if (targetPosition > maximumScrollPosition) targetPosition = maximumScrollPosition;
        this.scrollVerticalTickToPosition(currentPosition, targetPosition)
    }
};;
"use strict";
var injectAction;

function GlobalSearch() {
    this.login_url = baseUrl + "/user/login?redirect=1";
    this.isUserLogin = user_is != "";
    this.loadingViewContent = null;
    this.loadingView = document.getElementById("loading_spinner") || undefined;
    this.notificationView = '<div class="noti {{type}}">{{content}}<a href="javascript:void(0)" class="noti-close" id="mbl-noti-close"><span class="icon-cross97"></span></a></div>';
    this.loginJSUrl = baseUrl + "/js/app/loginInit.js?v=5";
    this.user = {
        isLogin: this.isUserLogin
    };
    this.isMobile = isMobile ? 1 : 0
}
GlobalSearch.prototype.init = function() {
    $bm("#mbl-login-button").addListener("click", function(e) {
        e.preventDefault();
        global.openLogin()
    })
};
GlobalSearch.prototype.openLogin = function() {
    if (!this.isMobile) {
        handleLoginClickEvent()
    } else {
        global.loadingViewContent = "<i>Please wait</i>";
        global.loadinViewAction();
        $bm("document").loadJS(global.loginJSUrl, function() {
            injectAction = new InjectAction;
            injectAction.isMobile = true;
            injectAction.initialize(baseUrl + "/js/app/login.js?v=12", function() {
                !!injectAction.loginFileInjected && injectAction.showModal()
            })
        })
    }
};
GlobalSearch.prototype.goto = function(url) {
    window.location = url
};
GlobalSearch.prototype.showNotification = function(type, content) {
    var notificationView = this.notificationView;
    notificationView = notificationView.replace("{{type}}", type);
    notificationView = notificationView.replace("{{content}}", content);
    $bm("#noti-view").injectDOM("#noti-view", notificationView, "append")
};
GlobalSearch.prototype.hideNotification = function() {
    if (!!document.querySelector("#noti-view > div")) {
        document.querySelector("#noti-view > div").remove()
    }
};
GlobalSearch.prototype.loadinViewAction = function(type) {
    if (!!this.loadingView) {
        type = typeof type == "undefined" ? "add" : type;
        if (type == "add" && this.loadingViewContent) {
            this.loadingView.innerHTML = '<span class="spinner-circle"></span>' + this.loadingViewContent
        }
        this.loadingView.style.display = type == "remove" ? "none" : "block";
        if (this.loadingViewContent && type == "remove") {
            global = new GlobalSearch
        }
    }
};
GlobalSearch.prototype.watchLoginStatus = function() {
    $bm("document").watch(global.user, "isLogin", function(id, oldval, newval) {
        oldval == false && newval == true && profileDropView.updateUserProfileDropDown();
        newval == true && $bm("document").unwatch(global.user, "isLogin")
    })
};
GlobalSearch.prototype.setUserLoginStatus = function(status) {
    global.user.isLogin = status
};
var global = new GlobalSearch;
global.init();
global.watchLoginStatus();

function SeachDropdown() {
    this.choosen = -1;
    this.limit = 0;
    this.goto = null
}
SeachDropdown.prototype.listen = function() {
    var self = this;
    $bm("[type=search]").addListener("keydown", function(e) {
        e.keyCode == 40 && self.action("down");
        e.keyCode == 38 && self.action("up");
        e.keyCode == 13 && self.action("enter")
    })
};
SeachDropdown.prototype.action = function(type) {
    if (type == "down") {
        if (this.choosen < this.limit - 1) {
            this.choosen = this.choosen == -1 ? 0 : this.choosen + 1;
            var deSelectChoosen = this.choosen > 0 ? this.choosen - 1 : null;
            deSelectChoosen > -1 && $bm('[data-search-key="' + deSelectChoosen + '"]').removeClass("selected");
            $bm('[data-search-key="' + this.choosen + '"]').addClass("selected")
        }
    }
    if (type == "up") {
        if (this.choosen > -1) {
            this.choosen = this.choosen - 1;
            var deSelectChoosen = this.choosen + 1;
            deSelectChoosen > -1 && $bm('[data-search-key="' + deSelectChoosen + '"]').removeClass("selected");
            $bm('[data-search-key="' + this.choosen + '"]').addClass("selected")
        }
    }
    var enterDom = document.querySelector('[data-search-key="' + this.choosen + '"]');
    if (this.choosen > -1 && enterDom) {
        searchDropDown.goto = enterDom.href
    }
};
var searchDropDown = new SeachDropdown;
searchDropDown.listen();
var searchButton = $bm("#mbl-search-icon");
var searchInput = null;
searchButton.addListener("click", pullSearchView);

function pullSearchView(event) {
    event.preventDefault();
    searchButton.injectDOM(".top-search-form", searchFormView.sView, "replace");
    try {
        searchInput = document.querySelector("input[type=search]");
        searchInput.value = event.target.dataset.queryValue;
        $bm("#mbl-query-search-btn").addListener("click", searchFormView.searchQueryButtonClicked)
    } catch (e) {}
    searchFormView.hideShow()
}
var searchFormView = new SearchFormView;

function SearchFormView() {
    this.sView = '<div class="search-input"><input type="search" class="form-control" placeholder="Search"></div><button type="submit" value="Search" id="mbl-query-search-btn"><span class="icon-search"></span></button><div class="suggestions-dropdown" id="mbl-suggestions-dropdown"><div class="suggestions-holder"><div class="spinner-circle" id="mbl-bar-suggestion-spinner" style="display: none;"></div><div id="mbl-top-bar-suggestions"></div></div></div>';
    this.suggestions = [];
    this.suggestionDOM = $bm(".suggestions-dropdown");
    if (document.getElementById("mbl-suggestions-dropdown") && global.isMobile) document.getElementById("mbl-suggestions-dropdown").style.display = "block";
    this.oldSeachText = ""
}
SearchFormView.prototype.blockSubmitDesktopOnly = function() {
    $bm("#mbl-query-search-btn").addListener("click", searchFormView.searchQueryButtonClicked)
};
SearchFormView.prototype.hideShow = function() {
    $bm(".top-search-form").toggleClass("active");
    $bm("[type=search]").focus()
};
SearchFormView.prototype.searchQueryButtonClicked = function(event) {
    event.preventDefault();
    var q = document.querySelector("input[type=search]").value;
    q = q.replace(/\s/g, "");
    if (q.length > 0) {
        var url = searchDropDown.goto ? searchDropDown.goto : baseUrl + "?q=" + q;
        searchDropDown.goto = null;
        global.goto(url)
    }
};
SearchFormView.prototype.getSuggestions = function(query, type) {
    this.oldSeachText = query;
    var len = query.replace(/\s/g, "").length;
    var self = this;
    if (!global.isMobile) {
        document.getElementById("mbl-suggestions-dropdown").style.display = len > 3 ? "block" : "none"
    }
    if (type == "notrip") {
        if (len >= 3) {
            this.suggestionSpinner("block");
            var url = baseUrl + "/dom/getsuggestiondommbl?query=" + query + "&notrip=1";
            $bm("#mbl-suggestion-holder").getInjectDOM(url, "#mbl-suggestion-holder", "replace", function(res) {
                self.suggestionSpinner("none");
                searchDropDown.limit = $bm("[data-search-key]").elems.length;
                document.getElementById("mbl-suggestions-dropdown").style.display = "block"
            }, true)
        } else {
            this.hideSuggestionBox(type)
        }
    }
    if (type == "bar") {
        if (len >= 3) {
            this.barSuggestionSpinner("block");
            var url = baseUrl + "/dom/getsuggestiondommbl?query=" + query;
            $bm("#mbl-top-bar-suggestions").getInjectDOM(url, "#mbl-top-bar-suggestions", "replace", function(res) {
                self.barSuggestionSpinner("none");
                searchDropDown.limit = $bm("[data-search-key]").elems.length;
                document.getElementById("mbl-suggestions-dropdown").style.display = "block"
            }, true)
        } else {
            this.hideSuggestionBox(type);
            self.barSuggestionSpinner("none")
        }
    }
};
SearchFormView.prototype.suggestionSpinner = function(type) {
    if (document.getElementById("mbl-suggestion-spinner")) document.getElementById("mbl-suggestion-spinner").style.display = type
};
SearchFormView.prototype.barSuggestionSpinner = function(type) {
    if (document.getElementById("mbl-bar-suggestion-spinner")) document.getElementById("mbl-bar-suggestion-spinner").style.display = type
};
SearchFormView.prototype.hideSuggestionBox = function(type) {
    type == "notrip" && $bm("#mbl-suggestion-holder").injectDOM("#mbl-suggestion-holder", "", "replace");
    type == "bar" && $bm("#mbl-top-bar-suggestions").injectDOM("#mbl-top-bar-suggestions", "", "replace")
};
$bm("#mbl-home-search-button2").addListener("click", function(e) {
    e.preventDefault();
    var q = document.querySelector("input[type=search-no-trip]").value;
    q = q.replace(/\s/g, "");
    if (q.length > 0) {
        var url = baseUrl + "?q=" + q;
        global.goto(url)
    }
});
document.addEventListener("keyup", function(e) {
    if (e.target.id == "no-trip-input" && searchFormView.oldSeachText != e.target.value) {
        searchFormView.getSuggestions(e.target.value, "notrip");
        return
    }
    if (e.target.type == "search" && searchFormView.oldSeachText != e.target.value) {
        searchFormView.getSuggestions(e.target.value, "bar")
    }
    e.stopPropagation()
});
searchFormView.suggestionSpinner("none");
!global.isMobile && searchFormView.blockSubmitDesktopOnly();

function ProfileDropView() {
    this.loading = false;
    this.dom = null;
    this.profileDropDownButton = null;
    this.dropdownUrl = global.isMobile ? baseUrl + "/dom/mobileprofiledropdown" : baseUrl + "/dom/desktopprofiledropdown"
}
ProfileDropView.prototype.dropDown = function(inject) {
    this.loading = true;
    try {
        var self = this;
        !this.dom && this.pull(function() {
            inject && self.showHide()
        });
        this.dom && inject && self.showHide();
        this.loading = !inject ? false : this.loading
    } catch (e) {
        console.log(e)
    }
};

function pullProfileDropDownOnMove() {
    $bm("document").removeListener("mousemove", pullProfileDropDownOnMove);
    profileDropView.pull(function() {})
}
ProfileDropView.prototype.pull = function(callback) {
    var self = this;
    this.profileDropDownButton.getInjectDOM(this.dropdownUrl, "#mbl-p-dropdown", "replace", function(res) {
        self.dom = res;
        typeof callback == "function" ? callback() : void 0
    })
};
ProfileDropView.prototype.init = function() {
    this.profileDropDownButton = $bm("#mbl-user-profile-dropwdown-view");
    $bm("document").addListener("mousemove", pullProfileDropDownOnMove);
    this.profileDropDownButton.addListener("click", function(event) {
        !profileDropView.loading && profileDropView.dropDown(true)
    });
    $bm("document").addListener("touchmove", profileDropViewPull)
};
ProfileDropView.prototype.showHide = function() {
    this.loading = false;
    $bm("#mbl-user-profile-dropwdown-view").toggleClass("active");
    $bm(".prof").toggleClass("active")
};
ProfileDropView.prototype.hide = function() {
    this.loading = false;
    $bm("#mbl-user-profile-dropwdown-view").removeClass("active");
    $bm(".prof").removeClass("active")
};
ProfileDropView.prototype.updateUserProfileDropDown = function() {
    var url = baseUrl + "/dom/logindom?m=" + global.isMobile;
    var oldDom = document.getElementById("mbl-non-login-header");
    !global.isMobile && oldDom.classList.add("prof");
    $bm("document").get(url, function(res) {
        var response = JSON.parse(res);
        mychannel = "channel_" + response.id;
        if (!!domdata) {
            domdata.user_id = response.id
        }
        typeof PusherConnect == "function" && PusherConnect();
        profileDropView.loading = false;
        $bm("document").injectDOM("#mbl-non-login-header", response.dom, "replace");
        if (!global.isMobile && response.mdom) {
            $bm("document").injectDOM("#link-register-header", response.mdom, "replace")
        }
        setTimeout(function() {
            profileDropView.init()
        }, 100)
    })
};

function profileDropViewPull() {
    !profileDropView.loading && profileDropView.dropDown(false);
    $bm("document").removeListener("touchmove", profileDropViewPull)
}
var profileDropView = new ProfileDropView;
global.isUserLogin && profileDropView.init();

function Footer() {}
Footer.prototype.injectDOM = function() {
    var self = this;
    $bm("#mbl-footer-right").getInjectDOM(baseUrl + "/dom/mobilefooterview", "#mbl-footer-right", "replace", function(res) {
        loadFBTwitter();
        footer.addCurrencyEventListener();
        emailSubs.listenInput()
    })
};
Footer.prototype.addCurrencyEventListener = function() {
    setTimeout(function() {
        currencyPicker.injectOptionDom()
    }, 500);
    reInitListenActions()
};
reInitListenActions();

function reInitListenActions() {
    setTimeout(function() {
        document.addEventListener("touchstart", universalHandler, false);
        document.addEventListener("click", universalHandler, false);
        document.addEventListener("click", customHandler, false)
    }, 500)
}
var currencyPicker = new CurrencyPicker;

function CurrencyPicker() {
    this.selected_currency = null;
    this.selected_seperator = null
}
CurrencyPicker.prototype.change = function(event) {
    try {
        var options = document.getElementById("changeCurrencyFooter").options;
        var selected = event.target.selectedOptions[0];
        this.selected_currency = selected.value;
        this.selected_seperator = selected.getAttribute("data-seperator");
        for (var key in options) {
            if (typeof options[key] == "object" && options[key].value != "") {
                options[key].value != this.selected_currency ? options[key].removeAttribute("selected") : options[key].setAttribute("selected", true)
            }
        }
        this.refreshPage()
    } catch (e) {
        console.log(e)
    }
};
CurrencyPicker.prototype.refreshPage = function() {
    this.selected_seperator = this.selected_seperator == "." ? "dot" : this.selected_seperator == "," ? "comma" : this.selected_seperator == " " ? "space" : this.selected_seperator == "'" ? "apos" : "";
    var url = baseUrl + "/currencymanager/default/setcurrency/currency/" + this.selected_currency + "/seperator/" + this.selected_seperator;
    global && global.loadinViewAction();
    $bm("document").get(url, function() {
        window.location.reload(true)
    })
};
CurrencyPicker.prototype.injectOptionDom = function() {
    try {
        var lists = JSON.parse(document.getElementById("changeCurrencyFooter").dataset.mblCurrencyOptions);
        var dropdown = document.getElementById("changeCurrencyFooter");
        if (dropdown.length == 1) {
            for (var key in lists) {
                $bm("#changeCurrencyFooter").injectDOM("#changeCurrencyFooter", lists[key], "append")
            }
        }
        setTimeout((function() {
            dropdown.click()
        }, 100))
    } catch (e) {
        console.log(e)
    }
};

function ScrollEvent() {
    this.currentScrollPos = 0;
    this.isFooterInViewPort = false
}
ScrollEvent.prototype.start = function() {
    $bm("document").addListener("scroll", listeningScrollEvent)
};
ScrollEvent.prototype.stop = function() {
    $bm("document").removeListener("scroll", listeningScrollEvent)
};
ScrollEvent.prototype.scrollTo = function(pos) {
    window.scrollTo(0, pos)
};

function listeningScrollEvent(e) {
    try {
        scroll.currentScrollPos = window.pageYOffset;
        !scroll.isFooterInViewPort && $bm("#mbl-footer-right").isInViewport(function(is) {
            scroll.isFooterInViewPort = is;
            if (scroll.isFooterInViewPort) {
                footer.injectDOM()
            }
        })
    } catch (err) {
        console.log(err)
    }
}
var scrollEvent = new ScrollEvent;
scrollEvent.start();
var footer = new Footer;

function EmailSubs() {
    this.email = "";
    this.isSubmitting = false
}
EmailSubs.prototype.listenInput = function() {
    try {
        var self = this;
        $bm("#subs_email_input").addListener("keyup", function(e) {
            e.preventDefault();
            self.email = e.target.value;
            self.isvalidateEmail() ? $bm(".f-agree").showDOM() : $bm(".f-agree").hideDOM()
        })
    } catch (e) {
        console.log(e)
    }
};
EmailSubs.prototype.isvalidateEmail = function() {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(this.email).toLowerCase())
};
EmailSubs.prototype.isTermsPolicyAccepted = function() {
    return document.getElementById("footer-signup-check").checked || false
};
EmailSubs.prototype.submit = function() {
    try {
        var url = baseUrl + "/newsletter/ws/emailletter";
        var request = {
            email: this.email
        };
        var isSubmitting = this.isSubmitting;
        this.isSubmitting = true;
        !isSubmitting && this.isTermsPolicyAccepted() && this.isvalidateEmail() ? $bm("document").postAjax(url, request, function(res) {
            emailSubs.isSubmitting = false;
            var response = JSON.parse(res);
            if (response.status) {
                global.showNotification("green", response.message);
                $bm("#after_sub_msg").changeInnerText(response.message)
            }
        }, "application/json;charset=UTF-8") : emailSubs.isSubmitting = false
    } catch (e) {
        console.log(e)
    }
};
var emailSubs = new EmailSubs;
var dataDiscount = $bm("[data-discount-save]");
var discountView = new DiscountView;
dataDiscount.addListener("click", function(event) {
    event.preventDefault();
    try {
        discountView.trip_id = event.currentTarget.dataset.discountSave;
        discountView.discountAmount = event.currentTarget.dataset.discountAmount;
        !discountView.inProgress && discountView.openDiscountModal()
    } catch (e) {
        console.log(e)
    }
});

function DiscountView() {
    this.trip_id = null;
    this.discountAmount = 0;
    this.discountModal = null;
    this.inProgress = false
}
DiscountView.prototype.openDiscountModal = function() {
    this.inProgress = true;
    var self = this;
    var jsUrl = baseUrl + "/src-js/app/unlockDiscountMbl.js";
    if (self.discountModal == null && self.discountAmount) {
        global.loadinViewAction();
        dataDiscount.getInjectDOM(baseUrl + "/dom/unlockdiscountmbl?m=" + global.isMobile, "#data-discount-save-view", "replace", function(res) {
            self.discountModal = res;
            dataDiscount.loadJS(jsUrl, function() {
                inject()
            })
        })
    } else if (self.discountModal != null && self.discountAmount) {
        global.loadinViewAction();
        inject()
    }

    function inject() {
        global.loadinViewAction("remove");
        self.inProgress = false;
        $bm("#unlock_discount_modal").addClass("active");
        var unlockText = "Unlock <b>" + self.discountAmount + "</b> in Tour Savings";
        var selector = "#unlock_discount_modal > div > div.locked-preview > div > strong";
        dataDiscount.injectDOM(selector, unlockText);
        reInitListenActions()
    }
};
var hamburgerMenuButton = $bm("#menu-opener");
hamburgerMenuButton.addListener("click", function(event) {
    event.preventDefault();
    $bm("#wrapper").toggleClass("menu-active")
});

function loadFBTwitter() {
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.8&appId=1581686285431624";
        fjs.parentNode.insertBefore(js, fjs)
    })(document, "script", "facebook-jssdk");
    window.twttr = function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0],
            t = window.twttr || {};
        if (d.getElementById(id)) return t;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js, fjs);
        t._e = [];
        t.ready = function(f) {
            t._e.push(f)
        };
        return t
    }(document, "script", "twitter-wjs")
}

function customHandler(e) {
    try {
        if (e.target && e.target.id == "map_view_close" || e.target.parentElement.id == "map_view_close") {
            $bm(".map-view").removeClass("active")
        }
    } catch (err) {}
}

function universalHandler(e) {
    try {
        if (e.target && e.target.id == "mbl-subscribers-submit") {
            emailSubs.submit()
        }
        if (e.target && (e.target.id == "mbl-noti-close" || e.target.parentElement.id == "mbl-noti-close")) {
            global.hideNotification()
        }
        if (e.target && (e.target.id == "unlock_modal_close_a" || e.target.parentElement.id == "unlock_modal_close_a")) {
            $bm("#unlock_discount_modal").removeClass("active")
        }
        if (e.target.className == "w1") {
            $bm("#wrapper").removeClass("menu-active")
        }!global.isMobile && closeDropDownOnClickOutside(e)
    } catch (e) {
        console.log(e)
    }
}

function closeDropDownOnClickOutside(e) {
    var parentId = e.target.parentElement ? e.target.parentElement.id : null;
    var id = e.target.id;
    var parentClass = e.target.parentElement.classList ? e.target.parentElement.classList : [];
    parentClass = [].map.call(parentClass, function(e) {
        return e
    });
    var className = e.target.classList ? e.target.classList : [];
    className = [].map.call(className, function(e) {
        return e
    });
    if (parentId != "mbl-user-profile-dropwdown-view" && id != "mbl-user-profile-dropwdown-view") {
        profileDropView.hide()
    }
    if (parentId != "view_recent_tours" && id != "view_recent_tours") {
        recentViewTours.recentClass.removeClass("active")
    }
    if (parentClass.indexOf("cur") == -1 && className.indexOf("cur") == -1) {
        currencyDropDown.dropDownBtn.removeClass("active")
    }
    if ((parentClass.indexOf("btn-sort") > -1 || className.indexOf("btn-sort") > -1) && typeof sortTrip != "undefined") {
        sortTrip.toggleSortOption()
    } else if (typeof sortTrip != "undefined") {
        sortTrip.close()
    }
    if ((parentClass.indexOf("destination-dd") > -1 || className.indexOf("destination-dd") > -1) && (parentClass.indexOf("destination-dropdown-lists") == -1 || className.indexOf("destination-dropdown-lists") == -1) && typeof ddestinationDrop != "undefined") {
        ddestinationDrop.isdestInjected && ddestinationDrop.toggleDropdown("dest")
    } else if (typeof ddestinationDrop != "undefined" && parentClass.indexOf("destination-dropdown-lists") == -1 && className.indexOf("destination-dropdown-lists") == -1) {
        ddestinationDrop.isdestInjected && ddestinationDrop.close("dest")
    }
    if ((parentClass.indexOf("activity-dd") > -1 || className.indexOf("activity-dd") > -1) && (parentClass.indexOf("activity-dropdown-lists") == -1 || className.indexOf("activity-dropdown-lists") == -1) && typeof ddestinationDrop != "undefined") {
        ddestinationDrop.isactInjected && ddestinationDrop.toggleDropdown("act")
    } else if (typeof ddestinationDrop != "undefined" && parentClass.indexOf("activity-dropdown-lists") == -1 && className.indexOf("activity-dropdown-lists") == -1) {
        ddestinationDrop.isactInjected && ddestinationDrop.close("act")
    }
    if (parentClass.indexOf("top-search") == -1) {
        $bm("#mbl-suggestions-dropdown").hideDOM()
    } else {
        if (parentClass.indexOf("top-search") > -1) {
            e.target.value.replace("/ /", "").length > 0 ? searchFormView.getSuggestions(e.target.value, "bar") : void 0
        }
    }
}
document.addEventListener("change", function(e) {
    if (e.target && event.target.id == "changeCurrencyFooter") {
        e.preventDefault();
        currencyPicker.change(e)
    }
});
var imgLazyLoading = function() {
    function isVisible(elem) {
        var coords = elem.getBoundingClientRect();
        var windowHeight = document.documentElement.clientHeight;
        var topVisible = coords.top > 0 && coords.top < windowHeight;
        var bottomVisible = coords.bottom < windowHeight && coords.bottom > 0;
        return topVisible || bottomVisible
    }

    function showVisible() {
        var imageLists = document.querySelectorAll("img");
        for (var key in imageLists) {
            var img = imageLists[key];
            var img = imageLists[key];
            if (img && !!img.dataset) {
                var realSrc = img.dataset.src;
                if (!realSrc) continue;
                if (isVisible(img)) {
                    img.src = realSrc;
                    img.dataset.src = ""
                }
            }
        }
        if (Array.from(document.querySelectorAll("[data-src]")).every(function(img) {
                return img.getAttribute("data-src") === ""
            })) window.removeEventListener("scroll", showVisible)
    }
    window.addEventListener("scroll", showVisible);
    showVisible()
};

function CommonFunction() {
    return {
        imageLazyLoading: imgLazyLoading
    }
}
var triggerImageLazyLoading = CommonFunction().imageLazyLoading;
triggerImageLazyLoading();

function MessageCounter() {
    this.audio = null;
    this.dom = '<span class="msg-count">{{counter}}</span>';
    this.parentDom = $bm("[data-id=message-counter-parent]").elems[0];
    try {
        this.counter = this.parentDom.children.length == 2 ? this.parentDom.children[1].innerText : 0
    } catch (e) {
        this.counter = 0
    }
}
MessageCounter.prototype.listen = function() {
    try {
        if (this.parentDom.children.length != 2) {
            this.counter > 0 && this.initialDomInject()
        } else {
            this.counter = this.parentDom.children[1].innerText;
            this.makeMessageBlink()
        }
    } catch (e) {}
};
MessageCounter.prototype.initialDomInject = function() {
    if (this.parentDom.children.length != 2) {
        var newdom = this.dom.replace("{{counter}}", this.counter);
        $bm("document").injectDOM("[data-id=message-counter-parent]", newdom, "append")
    }
};
MessageCounter.prototype.increaseMessageCounter = function(count) {
    try {
        this.parentDom = $bm("[data-id=message-counter-parent]").elems[0];
        this.initialDomInject();
        this.counter = parseInt(this.counter) + parseInt(count);
        var counterDom = this.parentDom.children[1];
        if (!!counterDom) {
            counterDom.innerText = this.counter
        }
        this.removeCounterDom();
        this.playSound()
    } catch (e) {}
};
MessageCounter.prototype.removeCounterDom = function() {
    this.counter == 0 && this.parentDom.children[1].parentNode.removeChild(this.parentDom.children[1])
};
MessageCounter.prototype.playSound = function() {
    try {
        this.audio = this.audio == null ? new Audio("https://www.bookmundi.com/files/sounds/newmessage.mp3") : this.audio;
        this.counter > 0 ? this.audio.play() : void 0;
        this.makeMessageBlink()
    } catch (e) {}
};
MessageCounter.prototype.makeMessageBlink = function() {
    this.counter == 0 ? $bm(".msg-top").removeClass("blinking") : $bm(".msg-top").addClass("blinking")
};
var messageCounter = new MessageCounter;
messageCounter.listen();

function CurrencyDropdown() {
    this.dropDownBtn = $bm(".cur")
}
CurrencyDropdown.prototype.listenHover = function() {
    $bm("document").addListener("mousemove", onHoverCurrencyPickerAction)
};

function onHoverCurrencyPickerAction(e) {
    e.preventDefault();
    $bm("document").removeListener("mousemove", onHoverCurrencyPickerAction);
    var url = baseUrl + "/dom/currencypicker";
    $bm("document").getInjectDOM(url, ".cur", "append", function() {
        currencyDropDown.listenClick()
    }, true)
}
CurrencyDropdown.prototype.listenClick = function() {
    this.dropDownBtn.addListener("click", function(e) {
        e.preventDefault();
        currencyDropDown.dropDownBtn.toggleClass("active")
    })
};
var currencyDropDown = new CurrencyDropdown;
!global.isMobile && currencyDropDown.listenHover();

function changeCurrency(curr, seperator) {
    if (seperator == ".") {
        seperator = "dot"
    }
    if (seperator == ",") {
        seperator = "comma"
    }
    if (seperator == " ") {
        seperator = "space"
    }
    if (seperator == "'") {
        seperator = "apos"
    }
    url = baseUrl + "/currencymanager/default/setcurrency/currency/" + curr + "/seperator/" + seperator;
    $bm("document").get(url, function() {
        window.location.reload(true)
    })
}

function DesktopLogin() {
    this.loginBtn = $bm("#desktop-login-button");
    this.registerBtn = $bm("#desktop-register-button");
    this.activeView = "signin"
}
DesktopLogin.prototype.init = function() {
    !!this.loginBtn && this.loginBtn.addListener("click", function(e) {
        e.preventDefault();
        desktopLogin.activeView = "signin";
        handleLoginClickEvent()
    });
    !!this.registerBtn && this.registerBtn.addListener("click", function(e) {
        e.preventDefault();
        desktopLogin.activeView = "register";
        handleLoginClickEvent()
    })
};

function handleLoginClickEvent() {
    $bm("document").loadJS(global.loginJSUrl, function() {
        injectAction = new InjectAction;
        injectAction.activeView = desktopLogin.activeView;
        var lUrl = baseUrl + "/js/app/login.js?v=2";
        injectAction.initialize(lUrl, function() {
            !!injectAction.loginFileInjected && injectAction.showModal()
        })
    })
}
var desktopLogin = new DesktopLogin;
desktopLogin.init();

function RecentViewTours() {
    this.recentClass = $bm(".rt");
    this.btn = $bm("#view_recent_tours");
    this.domLists = null
}
RecentViewTours.prototype.listen = function() {
    this.btn.addListener("click", function(e) {
        e.preventDefault();
        recentViewTours.recentClass.toggleClass("active");
        !recentViewTours.domLists && recentViewTours.injectDom()
    })
};
RecentViewTours.prototype.injectDom = function() {
    var url = domdata.baseUrl + "/ws/getRecentTrips/";
    $bm("document").getInjectDOM(url, "#recent-dropdown-list", "replace")
};
var recentViewTours = new RecentViewTours;
recentViewTours.listen();
if (typeof Storage !== "undefined") {
    try {
        if (localStorage.getItem("cookie-hide") == null) {
            $bm(".cookie-bar").showDOM();
            setTimeout(function() {
                hideCookie()
            }, 1e4)
        }
    } catch (e) {}
}
$bm(".btn-cookie").addListener("click", function(event) {
    event.preventDefault();
    hideCookie()
});

function hideCookie() {
    if (typeof Storage !== "undefined") {
        try {
            localStorage.setItem("cookie-hide", true)
        } catch (e) {}
    }
    $bm(".cookie-bar").hideDOM()
};

function DomData() {
    this.baseUrl = baseUrl;
    this.jsVersion = .2;
    this.isDebug = isDebug
}
var domdata = new DomData;

function BLoader() {
    try {
        var loader = document.getElementsByClassName("bloader")[0];
        return {
            show: function() {
                loader.style.display = "block"
            },
            hide: function() {
                loader.style.display = "none"
            }
        }
    } catch (e) {}
}
var bloader = new BLoader;

function CmsMap() {
    this.isinViewPort = false;
    $bm("document").addListener("scroll", listeningScrollEvent)
}
CmsMap.prototype.init = function() {
    $bm("document").addListener("scroll", cmsMapScrollEvent)
};
CmsMap.prototype.drawMap = function() {
    $bm("document").removeListener("scroll", cmsMapScrollEvent);
    var src = "https://maps.googleapis.com/maps/api/js?libraries=geometry,places&language=en&v=3.33&key=" + bmGlobalVars.GOOGLE_KEY;
    $bm("document").loadJS(src, function() {
        try {
            var mapId = document.getElementById("searchPageMap");
            var latitude = mapId.getAttribute("data-latitude");
            var longitude = mapId.getAttribute("data-longitude");
            var zoom = parseInt(mapId.getAttribute("data-zoom"));
            var mapOptions = {
                center: new google.maps.LatLng(latitude, longitude),
                zoom: zoom,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("searchPageMap"), mapOptions);
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(latitude, longitude),
                icon: "https://www.bookmundi.com/themes/global/resources/images/bookmundi-pin.png"
            });
            marker.setMap(map);
            google.maps.event.trigger(marker, "resize")
        } catch (e) {}
    })
};

function cmsMapScrollEvent(event) {
    !cmsMap.isinViewPort && $bm("#mbl-article-main").isInViewport(function(is) {
        cmsMap.isinViewPort = is;
        if (cmsMap.isinViewPort) {
            cmsMap.drawMap()
        }
    })
}
var cmsMap = new CmsMap;
cmsMap.init();
(function() {
    var doms = $bm("[data-cms-sidebar-id]");
    var activeIds = [];
    doms.each(function(dom) {
        activeIds[dom.dataset.cmsSidebarId] = false
    });
    $bm("document").addListener("scroll", cmsContentScrollEvent);

    function cmsContentScrollEvent() {
        $bm("h4").isInViewportWithEvent(function(is, event) {
            try {
                if (typeof event.getAttribute("data-cms-title") != "undefined") {
                    var id = event.getAttribute("data-cms-title");
                    activeIds[id] = is
                }
            } catch (err) {
                console.log(err)
            }
        });
        $bm("[data-cms-sidebar-id]").removeClass("active");
        for (var key in activeIds) {
            if (activeIds[key]) {
                var selector = "[data-cms-sidebar-id='" + key + "']";
                $bm(selector).addClass("active");
                return
            }
        }
    }
})();

function MapView() {
    this.mapButton = $bm("#trip-map-tag");
    this.mapDetails = null;
    this.mapFileUrl = domdata.baseUrl + "/js/app/desktop-map.js?v=" + domdata.jsVersion;
    this.mapCssUrl = domdata.baseUrl + "/themes/rupa/resources/css/product/map-details.css?v=" + domdata.jsVersion;
    this.activateClass = "modal-open"
}
MapView.prototype.init = function() {
    var self = this;
    this.mapButton.addListener("click", function(event) {
        event.preventDefault();
        bloader.show();
        self.mapDetails = event.currentTarget.dataset;
        loadReactFiles(function() {
            $bm("document").loadCSS(self.mapCssUrl, function() {
                $bm("document").loadJS(self.mapFileUrl, function() {
                    typeof mapModalComponent != undefined ? mapModalComponent.reCallMapFile(self.mapDetails.targetId) : void 0;
                    typeof mapModalComponent != undefined ? mapModalComponent.forceUpdate() : void 0;
                    self.toggleModal()
                })
            })
        })
    })
};
MapView.prototype.toggleModal = function() {
    $bm("body").toggleClass(this.activateClass);
    $bm(".map-view").addClass("active");
    bloader.hide()
};
var mapViews = new MapView;
mapViews.init();

function loadReactFiles(callback) {
    var doc = $bm("document");
    if (domdata.isDebug != 1) {
        var reactFile = domdata.baseUrl + "/js/react/react_dom_prod.min.js";
        doc.loadJS(reactFile, function() {
            callback()
        })
    } else {
        var reactFile = domdata.baseUrl + "/js/react/react.min.js";
        var reactDom = domdata.baseUrl + "/js/react/react-dom.min.js";
        doc.loadJS(reactFile, function() {
            doc.loadJS(reactDom, function() {
                callback()
            })
        })
    }
}(function() {
    function SecondaryJsFiles() {
        this.cssImageFiles = [domdata.baseUrl + "/themes/rupa/resources/css/common/login-signup.css", domdata.baseUrl + "/themes/rupa/resources/css/common/dest.css?v=1", domdata.baseUrl + "/themes/rupa/resources/css/search/components/sort-by.css", domdata.baseUrl + "/themes/rupa/resources/css/common/tiny-slider.css?v=0.1", domdata.baseUrl + "/themes/rupa/resources/css/common/glightbox.min.css?v=0.1", domdata.baseUrl + "/themes/rupa/resources/css/search/components/nouislider.css", domdata.baseUrl + "/themes/rupa/resources/css/common/recent-trips.css"];
        this.jsFiles = [domdata.baseUrl + "/themes/rupa/resources/js/search/critical/carousel_helper.js?" + domdata.jsVersion, domdata.baseUrl + "/themes/rupa/resources/js/search/critical/scripts.filter.js?" + domdata.jsVersion];
        this.isPulling = false
    }
    SecondaryJsFiles.prototype.listen = function() {
        var self = this;
        $bm("document").addListener("mousemove", handleMouseMove)
    };

    function handleMouseMove() {
        $bm("document").removeListener("mousemove", handleMouseMove);
        !sec.isPulling && sec.pullCssFile();
        !sec.isPulling && sec.pullJsFile(function() {
            $bm("#trending-destination-view").showDOM();
            $bm(".traveler-photos").showDOM();
            window.scrollBy(1, 0);
            setTimeout(function() {
                bookingSticky.init();
                bookingSticky.listenScroll()
            }, 2e3)
        });
        sec.isPulling = true
    }
    SecondaryJsFiles.prototype.pullCssFile = function() {
        for (var key in this.cssImageFiles) {
            $bm("document").loadCSS(this.cssImageFiles[key], function() {})
        }
    };
    SecondaryJsFiles.prototype.pullJsFile = function(callback) {
        var self = this;
        var count = this.jsFiles.length;
        for (var i = 0; i < count; i++) {
            (function(key, file, count) {
                $bm("document").loadJS(file, function() {
                    try {
                        key == count - 1 ? callback() : ""
                    } catch (e) {}
                })
            })(i, this.jsFiles[i], count)
        }
    };
    var sec = new SecondaryJsFiles;
    sec.listen()
})();
WishView.prototype.init = function() {
    $bm("document").addListener("mousemove", pullWishLists);
    wishButton.addListener("click", function(e) {
        e.preventDefault();
        wishView.trip_id = e.target.dataset.wishId;
        global.isUserLogin && wishView.updateWishList();
        !global.isUserLogin && global.openLogin()
    })
};

function pullWishLists() {
    if (!wishView.pullingWishLists && user_is != "") {
        wishView.pullingWishLists = true;
        var pullWishUrl = baseUrl + "/products/ws/getwishList?version=1";
        wishButton.get(pullWishUrl, function(res) {
            wishView.pullingWishLists = false;
            wishView.wishLists = JSON.parse(res);
            wishView.selectWishLists(false)
        });
        $bm("document").removeListener("mousemove", pullWishLists)
    }
}

function WishView() {
    this.trip_id = null;
    this.wishLists = [];
    this.pullingWishLists = false;
    this.customPopOverDom = '<i class="wish-popover"><span>Added to your Tour Wish List.<br>To access your Tour Wish List, click <a href="https://www.bookmundi.com/your-tour-wish-list" target="_blank" rel="noopener">here</a>.</span></i>'
}
WishView.prototype.updateWishList = function() {
    var wishUrl = baseUrl + "/products/ws/updatewishlist?id=" + this.trip_id;
    wishUrl += "&version=1";
    wishButton.get(wishUrl, function(res) {
        wishView.selectWishLists(res)
    })
};
WishView.prototype.changeHoverText = function(type, id, showCustomPopOver) {
    var text = !type ? "Add to your Tour Wish List" : "Remove from your Tour Wish List";
    var timeout = 0;
    (function(timeout, id, text) {
        setTimeout(function() {
            $bm('[data-wish-id="' + id + '"]').changeInnerText('<i class="wish-popover"><span>' + text + "</span></i>", true)
        }, timeout)
    })(timeout, id, text)
};
WishView.prototype.selectWishLists = function(individual) {
    var self = this;
    if (individual) {
        try {
            individual = JSON.parse(individual);
            individual.added == 1 ? $bm('[data-wish-id="' + this.trip_id + '"]').addClass("wish-active") : $bm('[data-wish-id="' + this.trip_id + '"]').removeClass("wish-active");
            self.changeHoverText(individual.added, this.trip_id, individual.added)
        } catch (e) {}
    } else {
        var wishLists = wishView.wishLists;
        for (var key in wishLists) {
            try {
                $bm('[data-wish-id="' + wishLists[key] + '"]').addClass("wish-active");
                self.changeHoverText(true, wishLists[key], false)
            } catch (e) {}
        }
    }
};
var wishButton = $bm(".wishlist-link");
var wishView = new WishView;
wishView.init();

function ToggleHighlights() {
    $bm(".see-preview").addListener("click", function(e) {
        e.preventDefault();
        var id = e.target.dataset.id;
        $bm("[data-trip-id='" + id + "']").toggleClass("preview-active")
    })
}
ToggleHighlights();
var review = new Review;

function Review() {
    this.page = null;
    this.did = null
}
Review.prototype.setData = function(event) {
    this.page = event.target.dataset.mblPage;
    this.did = event.target.dataset.mblDid
};
Review.prototype.loadMore = function() {
    var url = baseUrl + "/dom/getdestinationratingsmbl/did/" + this.did + "/page/" + this.page;
    $bm("#moreReviewsSec").removeDOM();
    $bm("document").getInjectDOM(url, "#agencyReviewRatings-holder", "append", function() {
        bookingSticky.init();
        bookingSticky.listenScroll()
    })
};
document.addEventListener("click", desktopClickHandler, false);

function desktopClickHandler(e) {
    try {
        if (e.target && e.target.id == "mbl-load-more-reviews") {
            review.setData(e);
            review.loadMore()
        }
        if (e.target && e.target.id == "mbl-subscribers-submit") {
            emailSubs.submit()
        }
    } catch (err) {}
}

function BookingFormSticky() {}
BookingFormSticky.prototype.init = function() {
    if (document.querySelector(".search-article") != null) {
        this.stikyBox = document.querySelector(".sidebar-fixed-holder");
        this.articleElm = document.querySelector(".search-article");
        this.articleElmOffset = offset(this.articleElm).top;
        this.stikyBoxHeight = this.stikyBox.offsetHeight;
        this.sideBoxHeight = document.querySelector(".sbox-wrap").offsetHeight;
        this.mainBarHeight = document.querySelector(".search-article").offsetHeight;
        this.currentPosition = window.scrollY;
        this.mainArticle = document.getElementById("mbl-article-main");
        this.mainArticleOffset = offset(this.mainArticle).top;
        this.secondaryNav = $bm(".secondary-nav")
    }
    this.fStikyBox = document.getElementById("applied-filters");
    this.sidebarFilter = document.getElementById("fixed-filter");
    this.sidebarWidth = this.sidebarFilter.offsetWidth;
    this.sidebarFilterHeight = this.sidebarFilter.offsetHeight;
    this.filtersBar = document.querySelector(".filters-sidebar");
    this.searchTwoColsHeight = document.getElementById("search-two-columns").offsetHeight;
    this.filtersBarHeight = this.filtersBar.offsetHeight;
    this.filtersBarOffset = offset(this.filtersBar).top;
    this.fStikyBox.style.width = this.sidebarWidth + "px"
};
BookingFormSticky.prototype.listenScroll = function() {
    var self = this;
    $bm("document").addListener("scroll", function(e) {
        self.currentPosition = window.scrollY;
        self.stickyClass()
    })
};
BookingFormSticky.prototype.stickyClass = function() {
    if (document.querySelector(".search-article") != null) {
        this.currentPosition > this.articleElmOffset + this.sideBoxHeight && this.currentPosition < this.mainBarHeight - this.stikyBoxHeight + this.articleElmOffset ? this.stikyBox.classList.add("active") : this.stikyBox.classList.remove("active");
        this.currentPosition > this.mainArticleOffset - 100 ? this.secondaryNav.addClass("active") : this.secondaryNav.removeClass("active")
    }
    this.currentPosition > this.filtersBarHeight + this.filtersBarOffset && this.currentPosition < this.searchTwoColsHeight + this.filtersBarOffset - this.fStikyBox.offsetHeight - 20 ? this.fStikyBox.classList.add("filters-fixed") : this.fStikyBox.classList.remove("filters-fixed")
};
var bookingSticky = new BookingFormSticky;
setTimeout(function() {
    bookingSticky.init();
    bookingSticky.listenScroll()
}, 2e3);

function offset(el) {
    if (el) {
        var rect = el.getBoundingClientRect(),
            scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return {
            top: rect.top + scrollTop,
            left: rect.left + scrollLeft
        }
    }
}

function SortTrip() {
    this.btn = $bm(".btn-sort");
    this.holder = $bm(".sort-by-holder")
}
SortTrip.prototype.toggleSortOption = function() {
    this.holder.toggleClass("active")
};
SortTrip.prototype.close = function() {
    this.holder.removeClass("active")
};
var sortTrip = new SortTrip;
$bm(".link-more-article").addListener("click", function(e) {
    e.preventDefault();
    BMScrollTo.scrollVerticalToElementById("main-search-article", 55)
});
$bm("#filter-fixed-btn").addListener("click", function(e) {
    e.preventDefault();
    BMScrollTo.scrollVerticalToElementById("content", 0)
});
$bm(".reviews-top").addListener("click", function(e) {
    e.preventDefault();
    BMScrollTo.scrollVerticalToElementById("customer-reviews-block", 0)
});
$bm('[data-r="reviews_count_dom"]').addListener("click", function(e) {
    e.preventDefault();
    BMScrollTo.scrollVerticalToElementById("customer-reviews-block", 0)
});
$bm("[data-cms-sidebar-id]").addListener("click", function(e) {
    e.preventDefault();
    try {
        var id = e.target.dataset.cmsSidebarId;
        var target = "cms-" + id;
        BMScrollTo.scrollVerticalToElementById(target, 70);
        var selector = "[data-cms-sidebar-id='" + id + "']";
        setTimeout(function() {
            $bm("[data-cms-sidebar-id]").removeClass("active");
            $bm(selector).addClass("active")
        }, 1e3)
    } catch (e) {}
});

function PdfDownload() {
    this.url = domdata.baseUrl + "/products/ws/sendemailpdf/";
    this.cssUrl = domdata.baseUrl + "/themes/rupa/resources/css/product/trip-notes.css?v=" + domdata.jsVersion;
    this.request = {
        destination_id: null,
        email: null
    };
    this.modalView = $bm("#trip_notes_modal");
    this.modalViewDom = document.getElementById("trip_notes_modal") || {
        style: {
            display: ""
        }
    };
    this.closeModalButton = $bm("#unlock_modal_close_a");
    this.submitButton = $bm("#submit-trip-note");
    this.inputForm = {
        email: null,
        acceptTerms: null
    };
    this.response = null;
    this.pdfButton = $bm("[data-pdfguide-link]")
}
PdfDownload.prototype.listen = function() {
    var self = this;
    this.modalViewDom.style.display = "none";
    this.pdfButton.addListener("click", function(e) {
        e.preventDefault();
        self.request.destination_id = e.target.dataset.pdfguideLink;
        self._pullCss(function() {
            setTimeout(function() {
                self.openModal()
            }, 500)
        })
    });
    var self = this;
    this.closeModalButton.addListener("click", function(event) {
        event.preventDefault();
        self.modalViewDom.style.display = "none";
        self.toggleModal()
    });
    this.submitButton.addListener("click", function(event) {
        event.preventDefault();
        self.validateForm() && self.sendRequest()
    })
};
PdfDownload.prototype.openModal = function() {
    this.modalViewDom.style.display = "block";
    this.initForm();
    this.toggleModal()
};
PdfDownload.prototype.toggleModal = function() {
    this.modalView.toggleClass("active")
};
PdfDownload.prototype.initForm = function() {
    try {
        this.inputForm.email = document.getElementById("unlock_email");
        this.inputForm.acceptTerms = document.getElementById("unlock-signup-check");
        this.setInputs("email", "");
        this.setInputs("acceptTerms", true);
        this.response = null;
        this.modalView.removeClass("downloaded");
        this.submitButton.removeClass("bg-loading");
        document.getElementById("tripnote-email-err").style.display = "none"
    } catch (e) {
        console.log(e)
    }
};
PdfDownload.prototype.setInputs = function(key, value) {
    if (key == "email") {
        this.inputForm.email.value = value
    }
    if (key == "acceptTerms") {
        this.inputForm.acceptTerms.checked = value
    }
};
PdfDownload.prototype.validateForm = function() {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var isEmailValid = re.test(String(this.inputForm.email.value).toLowerCase());
    var isAccepted = this.inputForm.acceptTerms.checked == true;
    document.getElementById("tripnote-email-err").style.display = isEmailValid ? "none" : "block";
    return isEmailValid && isAccepted
};
PdfDownload.prototype.sendRequest = function() {
    var self = this;
    this.request.email = this.inputForm.email.value;
    this.submitButton.addClass("bg-loading");
    $bm("document").postAjax(this.url, this.request, function(res) {
        try {
            self.response = JSON.parse(res);
            self.formSubmitted()
        } catch (e) {
            console.log(e)
        }
    }, "application/json;charset=UTF-8")
};
PdfDownload.prototype.formSubmitted = function() {
    try {
        download(domdata.title + ".pdf", this.response.pdf_link);
        this.modalView.addClass("downloaded")
    } catch (e) {
        console.log(e)
    }
};
PdfDownload.prototype._pullCss = function(callback) {
    $bm("document").loadCSS(this.cssUrl, function() {
        callback()
    })
};
var pdfDownload = new PdfDownload;
pdfDownload.listen();

function download(filename, uri) {
    var link = document.createElement("a");
    link.download = name;
    link.target = "_blank";
    link.href = uri;
    link.click()
}
var triggers = Array.from(document.querySelectorAll('[data-toggle="collapse"]'));
$bm("document").addListener("click", function(ev) {
    var elm = ev.target;
    if (triggers.includes(elm)) {
        var selector = elm.getAttribute("data-target");
        collapse(selector, "toggle");
        elm.classList.toggle("expanded");
        if (elm.innerHTML) {
            elm.innerHTML = elm.innerHTML === "View More" ? "View Less" : "View More"
        }
    }
}, false);
var fnmap = {
    toggle: "toggle",
    show: "add",
    hide: "remove"
};
var collapse = function collapse(selector, cmd) {
    var targets = Array.from(document.querySelectorAll(selector));
    targets.forEach(function(target) {
        target.classList[fnmap[cmd]]("show")
    })
};
$bm(".filters-listing .opener").addListener("click", function(ev) {
    var elm = ev.target;
    elm.parentNode.classList.toggle("active")
}, false);
var scrollTopPos = 0,
    isMobileFilterActive;
$bm(".btn-filter-toggle").addListener("click", function(evt) {
    scrollTopPos = window.scrollY;
    isMobileFilterActive = true;
    $bm(".filters-sidebar").addClass("filter-active");
    $bm(".btn-filter-toggle").hideDOM();
    $bm("body").addClass("mobile-filter-active");
    window.scrollTo(0, 0)
});
$bm("#no-results-button").addListener("click", function(evt) {
    mobileFiltersAction();
    BMScrollTo.scrollVerticalToElementById("content", 0)
});
$bm("a.filter-cross").addListener("click", function(evt) {
    mobileFiltersAction()
});

function mobileFiltersAction() {
    isMobileFilterActive = false;
    $bm(".filters-sidebar").removeClass("filter-active");
    $bm(".btn-filter-toggle").showDOM();
    $bm("body").removeClass("mobile-filter-active")
}
$bm("a.filter-cross").addListener("click", function() {
    if (scrollTopPos > 0) window.scrollTo(0, scrollTopPos)
});

function reInitDomVariables() {
    setTimeout(function() {
        mapViews = new MapView;
        mapViews.init();
        wishButton = $bm(".wishlist-link");
        wishView = new WishView;
        wishView.init();
        ToggleHighlights();
        document.addEventListener("click", desktopClickHandler, false);
        bookingSticky = new BookingFormSticky;
        bookingSticky.init();
        bookingSticky.listenScroll()
    }, 500)
}

function DestinationDropdown() {
    this.btn = $bm("[data-destination-dropdown");
    this.actBtn = $bm("[data-activity-dropdown");
    this.durl = domdata.baseUrl + "/dom/desktopnavdestinations";
    this.aurl = domdata.baseUrl + "/dom/desktopnavactivity?q=" + q;
    this.aurl += !!q2 ? "&q2=" + q2 : "";
    this.aurl += !!q3 ? "&q3=" + q3 : "";
    this.isdestInjected = false;
    this.isactInjected = false;
    this.loadingDom = '<div class="dd-holder"><span class="dd-loading" style="display: block;min-height: 100px;"><span class="spinner-circle"></span></span></div>';
    this.isPulling = {
        dest: false,
        act: false
    }
}
DestinationDropdown.prototype.listen = function() {
    var self = this;
    this.btn.addListener("click", function(e) {
        e.preventDefault();
        try {
            !self.isdestInjected && bloader.show();
            !self.isdestInjected && !self.isPulling.dest && self.pullDom("dest", 1)
        } catch (e) {}
    });
    this.actBtn.addListener("click", function(e) {
        e.preventDefault();
        try {
            !self.isactInjected && bloader.show();
            !self.isactInjected && !self.isPulling.act && self.pullDom("act", 1)
        } catch (e) {}
    })
};
DestinationDropdown.prototype.pullDom = function(type, _showNow) {
    var self = this;
    if (type == "dest") {
        self.isPulling.dest = true;
        _showNow && self.toggleDropdown(type);
        $bm("document").injectDOM("#dest-dropdown-lists", this.loadingDom, "replace");
        $bm("document").getInjectDOM(this.durl, "#dest-dropdown-lists", "replace", function() {
            self.isdestInjected = true;
            bloader.hide();
            self.listenSideBarNav(type)
        })
    }
    if (type == "act") {
        self.isPulling.act = true;
        _showNow && self.toggleDropdown(type);
        $bm("document").injectDOM("#act-dropdown-lists", this.loadingDom, "replace");
        $bm("document").getInjectDOM(this.aurl, "#act-dropdown-lists", "replace", function() {
            self.isactInjected = true;
            bloader.hide();
            self.listenSideBarNav(type)
        })
    }
};
DestinationDropdown.prototype.toggleDropdown = function(type) {
    type == "dest" && $bm(".destination-dd").toggleClass("active");
    type == "act" && $bm(".activity-dd").toggleClass("active")
};
DestinationDropdown.prototype.close = function(type) {
    type == "dest" && $bm(".destination-dd").removeClass("active");
    type == "act" && $bm(".activity-dd").removeClass("active")
};
DestinationDropdown.prototype.listenSideBarNav = function(type) {
    if (type == "dest") {
        $bm("[data-dest-sidebar-lists]").addListener("click", function(e) {
            e.preventDefault();
            var region = e.target.parentElement.dataset.destSidebarLists;
            var selectedData = '[data-dest-sidbar-view="' + region + '"]';
            $bm("[data-dest-sidbar-view]").removeClass("active");
            $bm(selectedData).addClass("active");
            var sideBar = '[data-dest-sidebar-lists="' + region + '"]';
            $bm("[data-dest-sidebar-lists]").removeClass("active");
            $bm(sideBar).addClass("active")
        })
    }
    if (type == "act") {
        $bm("[data-act-sidebar-lists]").addListener("click", function(e) {
            e.preventDefault();
            var region = e.target.parentElement.dataset.actSidebarLists;
            var selectedData = '[data-act-sidbar-view="' + region + '"]';
            $bm("[data-act-sidbar-view]").removeClass("active");
            $bm(selectedData).addClass("active");
            var sideBar = '[data-act-sidebar-lists="' + region + '"]';
            $bm("[data-act-sidebar-lists]").removeClass("active");
            $bm(sideBar).addClass("active")
        })
    }
};
var ddestinationDrop = new DestinationDropdown;
ddestinationDrop.listen();

function PaginationLoading() {
    var text = [
        ["Best Price Guaranteed", "We guarantee you the best price."],
        ["No Booking Fees", "No extra booking fees are charged."],
        ["Free Cancellation", "Free cancellation on most tours."]
    ];
    var index = Math.floor(Math.random() * 2) + 0;
    var dom = '<div class="spinner-heading"><span class="icon-check-mark"></span>' + text[index][0] + '</div><div class="spinner-info">' + text[index][1] + "</div>";
    0;
    $bm("#tours-main-holder").toggleClass("loading-page");
    $bm("#page-loadinng-text").changeInnerText(dom, true);
    $bm("#page-loading").toggleDom()
}
$bm(".pagination-list > li > a").addListener("click", function(e) {
    PaginationLoading()
});
setTimeout(function() {
    var liveNotiCSS = domdata.baseUrl + "/themes/rara/resources/css/search/toastr-static.css?v22";
    var liveNotiUrl = domdata.baseUrl + "/dom/getlivenotidom/?q=" + q;
    liveNotiUrl += !!q2 ? "&q2=" + q2 : "";
    liveNotiUrl += !!q3 ? "&q3=" + q3 : "";
    $bm("document").loadCSS(liveNotiCSS, function() {
        $bm("document").getInjectDOM(liveNotiUrl, "#data-live-noti-search", "replace", function(res) {
            $bm("#closeBtn").addListener("click", function() {
                document.getElementById("closeBtn").parentElement.style.display = "none"
            })
        })
    })
}, 1e3);; /*! lazysizes - v4.1.5 */
! function(a, b) {
    var c = b(a, a.document);
    a.lazySizes = c, "object" == typeof module && module.exports && (module.exports = c)
}(window, function(a, b) {
    "use strict";
    if (b.getElementsByClassName) {
        var c, d, e = b.documentElement,
            f = a.Date,
            g = a.HTMLPictureElement,
            h = "addEventListener",
            i = "getAttribute",
            j = a[h],
            k = a.setTimeout,
            l = a.requestAnimationFrame || k,
            m = a.requestIdleCallback,
            n = /^picture$/i,
            o = ["load", "error", "lazyincluded", "_lazyloaded"],
            p = {},
            q = Array.prototype.forEach,
            r = function(a, b) {
                return p[b] || (p[b] = new RegExp("(\\s|^)" + b + "(\\s|$)")), p[b].test(a[i]("class") || "") && p[b]
            },
            s = function(a, b) {
                r(a, b) || a.setAttribute("class", (a[i]("class") || "").trim() + " " + b)
            },
            t = function(a, b) {
                var c;
                (c = r(a, b)) && a.setAttribute("class", (a[i]("class") || "").replace(c, " "))
            },
            u = function(a, b, c) {
                var d = c ? h : "removeEventListener";
                c && u(a, b), o.forEach(function(c) {
                    a[d](c, b)
                })
            },
            v = function(a, d, e, f, g) {
                var h = b.createEvent("Event");
                return e || (e = {}), e.instance = c, h.initEvent(d, !f, !g), h.detail = e, a.dispatchEvent(h), h
            },
            w = function(b, c) {
                var e;
                !g && (e = a.picturefill || d.pf) ? (c && c.src && !b[i]("srcset") && b.setAttribute("srcset", c.src), e({
                    reevaluate: !0,
                    elements: [b]
                })) : c && c.src && (b.src = c.src)
            },
            x = function(a, b) {
                return (getComputedStyle(a, null) || {})[b]
            },
            y = function(a, b, c) {
                for (c = c || a.offsetWidth; c < d.minSize && b && !a._lazysizesWidth;) c = b.offsetWidth, b = b.parentNode;
                return c
            },
            z = function() {
                var a, c, d = [],
                    e = [],
                    f = d,
                    g = function() {
                        var b = f;
                        for (f = d.length ? e : d, a = !0, c = !1; b.length;) b.shift()();
                        a = !1
                    },
                    h = function(d, e) {
                        a && !e ? d.apply(this, arguments) : (f.push(d), c || (c = !0, (b.hidden ? k : l)(g)))
                    };
                return h._lsFlush = g, h
            }(),
            A = function(a, b) {
                return b ? function() {
                    z(a)
                } : function() {
                    var b = this,
                        c = arguments;
                    z(function() {
                        a.apply(b, c)
                    })
                }
            },
            B = function(a) {
                var b, c = 0,
                    e = d.throttleDelay,
                    g = d.ricTimeout,
                    h = function() {
                        b = !1, c = f.now(), a()
                    },
                    i = m && g > 49 ? function() {
                        m(h, {
                            timeout: g
                        }), g !== d.ricTimeout && (g = d.ricTimeout)
                    } : A(function() {
                        k(h)
                    }, !0);
                return function(a) {
                    var d;
                    (a = !0 === a) && (g = 33), b || (b = !0, d = e - (f.now() - c), d < 0 && (d = 0), a || d < 9 ? i() : k(i, d))
                }
            },
            C = function(a) {
                var b, c, d = 99,
                    e = function() {
                        b = null, a()
                    },
                    g = function() {
                        var a = f.now() - c;
                        a < d ? k(g, d - a) : (m || e)(e)
                    };
                return function() {
                    c = f.now(), b || (b = k(g, d))
                }
            };
        ! function() {
            var b, c = {
                lazyClass: "lazyload",
                loadedClass: "lazyloaded",
                loadingClass: "lazyloading",
                preloadClass: "lazypreload",
                errorClass: "lazyerror",
                autosizesClass: "lazyautosizes",
                srcAttr: "data-src",
                srcsetAttr: "data-srcset",
                sizesAttr: "data-sizes",
                minSize: 40,
                customMedia: {},
                init: !0,
                expFactor: 1.5,
                hFac: .8,
                loadMode: 2,
                loadHidden: !0,
                ricTimeout: 0,
                throttleDelay: 125
            };
            d = a.lazySizesConfig || a.lazysizesConfig || {};
            for (b in c) b in d || (d[b] = c[b]);
            a.lazySizesConfig = d, k(function() {
                d.init && F()
            })
        }();
        var D = function() {
                var g, l, m, o, p, y, D, F, G, H, I, J, K, L, M = /^img$/i,
                    N = /^iframe$/i,
                    O = "onscroll" in a && !/(gle|ing)bot/.test(navigator.userAgent),
                    P = 0,
                    Q = 0,
                    R = 0,
                    S = -1,
                    T = function(a) {
                        R--, a && a.target && u(a.target, T), (!a || R < 0 || !a.target) && (R = 0)
                    },
                    U = function(a, c) {
                        var d, f = a,
                            g = "hidden" == x(b.body, "visibility") || "hidden" != x(a.parentNode, "visibility") && "hidden" != x(a, "visibility");
                        for (F -= c, I += c, G -= c, H += c; g && (f = f.offsetParent) && f != b.body && f != e;)(g = (x(f, "opacity") || 1) > 0) && "visible" != x(f, "overflow") && (d = f.getBoundingClientRect(), g = H > d.left && G < d.right && I > d.top - 1 && F < d.bottom + 1);
                        return g
                    },
                    V = function() {
                        var a, f, h, j, k, m, n, p, q, r = c.elements;
                        if ((o = d.loadMode) && R < 8 && (a = r.length)) {
                            f = 0, S++, null == K && ("expand" in d || (d.expand = e.clientHeight > 500 && e.clientWidth > 500 ? 500 : 370), J = d.expand, K = J * d.expFactor), Q < K && R < 1 && S > 2 && o > 2 && !b.hidden ? (Q = K, S = 0) : Q = o > 1 && S > 1 && R < 6 ? J : P;
                            for (; f < a; f++)
                                if (r[f] && !r[f]._lazyRace)
                                    if (O)
                                        if ((p = r[f][i]("data-expand")) && (m = 1 * p) || (m = Q), q !== m && (y = innerWidth + m * L, D = innerHeight + m, n = -1 * m, q = m), h = r[f].getBoundingClientRect(), (I = h.bottom) >= n && (F = h.top) <= D && (H = h.right) >= n * L && (G = h.left) <= y && (I || H || G || F) && (d.loadHidden || "hidden" != x(r[f], "visibility")) && (l && R < 3 && !p && (o < 3 || S < 4) || U(r[f], m))) {
                                            if (ba(r[f]), k = !0, R > 9) break
                                        } else !k && l && !j && R < 4 && S < 4 && o > 2 && (g[0] || d.preloadAfterLoad) && (g[0] || !p && (I || H || G || F || "auto" != r[f][i](d.sizesAttr))) && (j = g[0] || r[f]);
                            else ba(r[f]);
                            j && !k && ba(j)
                        }
                    },
                    W = B(V),
                    X = function(a) {
                        s(a.target, d.loadedClass), t(a.target, d.loadingClass), u(a.target, Z), v(a.target, "lazyloaded")
                    },
                    Y = A(X),
                    Z = function(a) {
                        Y({
                            target: a.target
                        })
                    },
                    $ = function(a, b) {
                        try {
                            a.contentWindow.location.replace(b)
                        } catch (c) {
                            a.src = b
                        }
                    },
                    _ = function(a) {
                        var b, c = a[i](d.srcsetAttr);
                        (b = d.customMedia[a[i]("data-media") || a[i]("media")]) && a.setAttribute("media", b), c && a.setAttribute("srcset", c)
                    },
                    aa = A(function(a, b, c, e, f) {
                        var g, h, j, l, o, p;
                        (o = v(a, "lazybeforeunveil", b)).defaultPrevented || (e && (c ? s(a, d.autosizesClass) : a.setAttribute("sizes", e)), h = a[i](d.srcsetAttr), g = a[i](d.srcAttr), f && (j = a.parentNode, l = j && n.test(j.nodeName || "")), p = b.firesLoad || "src" in a && (h || g || l), o = {
                            target: a
                        }, p && (u(a, T, !0), clearTimeout(m), m = k(T, 2500), s(a, d.loadingClass), u(a, Z, !0)), l && q.call(j.getElementsByTagName("source"), _), h ? a.setAttribute("srcset", h) : g && !l && (N.test(a.nodeName) ? $(a, g) : a.src = g), f && (h || l) && w(a, {
                            src: g
                        })), a._lazyRace && delete a._lazyRace, t(a, d.lazyClass), z(function() {
                            (!p || a.complete && a.naturalWidth > 1) && (p ? T(o) : R--, X(o))
                        }, !0)
                    }),
                    ba = function(a) {
                        var b, c = M.test(a.nodeName),
                            e = c && (a[i](d.sizesAttr) || a[i]("sizes")),
                            f = "auto" == e;
                        (!f && l || !c || !a[i]("src") && !a.srcset || a.complete || r(a, d.errorClass) || !r(a, d.lazyClass)) && (b = v(a, "lazyunveilread").detail, f && E.updateElem(a, !0, a.offsetWidth), a._lazyRace = !0, R++, aa(a, b, f, e, c))
                    },
                    ca = function() {
                        if (!l) {
                            if (f.now() - p < 999) return void k(ca, 999);
                            var a = C(function() {
                                d.loadMode = 3, W()
                            });
                            l = !0, d.loadMode = 3, W(), j("scroll", function() {
                                3 == d.loadMode && (d.loadMode = 2), a()
                            }, !0)
                        }
                    };
                return {
                    _: function() {
                        p = f.now(), c.elements = b.getElementsByClassName(d.lazyClass), g = b.getElementsByClassName(d.lazyClass + " " + d.preloadClass), L = d.hFac, j("scroll", W, !0), j("resize", W, !0), a.MutationObserver ? new MutationObserver(W).observe(e, {
                            childList: !0,
                            subtree: !0,
                            attributes: !0
                        }) : (e[h]("DOMNodeInserted", W, !0), e[h]("DOMAttrModified", W, !0), setInterval(W, 999)), j("hashchange", W, !0), ["focus", "mouseover", "click", "load", "transitionend", "animationend", "webkitAnimationEnd"].forEach(function(a) {
                            b[h](a, W, !0)
                        }), /d$|^c/.test(b.readyState) ? ca() : (j("load", ca), b[h]("DOMContentLoaded", W), k(ca, 2e4)), c.elements.length ? (V(), z._lsFlush()) : W()
                    },
                    checkElems: W,
                    unveil: ba
                }
            }(),
            E = function() {
                var a, c = A(function(a, b, c, d) {
                        var e, f, g;
                        if (a._lazysizesWidth = d, d += "px", a.setAttribute("sizes", d), n.test(b.nodeName || ""))
                            for (e = b.getElementsByTagName("source"), f = 0, g = e.length; f < g; f++) e[f].setAttribute("sizes", d);
                        c.detail.dataAttr || w(a, c.detail)
                    }),
                    e = function(a, b, d) {
                        var e, f = a.parentNode;
                        f && (d = y(a, f, d), e = v(a, "lazybeforesizes", {
                            width: d,
                            dataAttr: !!b
                        }), e.defaultPrevented || (d = e.detail.width) && d !== a._lazysizesWidth && c(a, f, e, d))
                    },
                    f = function() {
                        var b, c = a.length;
                        if (c)
                            for (b = 0; b < c; b++) e(a[b])
                    },
                    g = C(f);
                return {
                    _: function() {
                        a = b.getElementsByClassName(d.autosizesClass), j("resize", g)
                    },
                    checkElems: g,
                    updateElem: e
                }
            }(),
            F = function() {
                F.i || (F.i = !0, E._(), D._())
            };
        return c = {
            cfg: d,
            autoSizer: E,
            loader: D,
            init: F,
            uP: w,
            aC: s,
            rC: t,
            hC: r,
            fire: v,
            gW: y,
            rAF: z
        }
    }
});