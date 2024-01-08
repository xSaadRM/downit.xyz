jQuery.noConflict();
(function($) {
    !(function (t) {
        var e = {};
        function n(r) {
          if (e[r]) return e[r].exports;
          var a = (e[r] = {
            i: r,
            l: !1,
            exports: {},
          });
          return t[r].call(a.exports, a, a.exports, n), (a.l = !0), a.exports;
        }
        (n.m = t),
          (n.c = e),
          (n.d = function (t, e, r) {
            n.o(t, e) ||
              Object.defineProperty(t, e, {
                enumerable: !0,
                get: r,
              });
          }),
          (n.r = function (t) {
            "undefined" != typeof Symbol &&
              Symbol.toStringTag &&
              Object.defineProperty(t, Symbol.toStringTag, {
                value: "Module",
              }),
              Object.defineProperty(t, "__esModule", {
                value: !0,
              });
          }),
          (n.t = function (t, e) {
            if ((1 & e && (t = n(t)), 8 & e)) return t;
            if (4 & e && "object" == typeof t && t && t.__esModule) return t;
            var r = Object.create(null);
            if (
              (n.r(r),
              Object.defineProperty(r, "default", {
                enumerable: !0,
                value: t,
              }),
              2 & e && "string" != typeof t)
            )
              for (var a in t)
                n.d(
                  r,
                  a,
                  function (e) {
                    return t[e];
                  }.bind(null, a)
                );
            return r;
          }),
          (n.n = function (t) {
            var e =
              t && t.__esModule
                ? function () {
                    return t.default;
                  }
                : function () {
                    return t;
                  };
            return n.d(e, "a", e), e;
          }),
          (n.o = function (t, e) {
            return Object.prototype.hasOwnProperty.call(t, e);
          }),
          (n.p = "/asset/"),
          n((n.s = 17));
      })([
        function (t, e) {
          (t.exports = function (t, e) {
            if (!(t instanceof e))
              throw new TypeError("Cannot call a class as a function");
          }),
            (t.exports.__esModule = !0),
            (t.exports.default = t.exports);
        },
        function (t, e, n) {
          var r = n(5);
          function a(t, e) {
            for (var n = 0; n < e.length; n++) {
              var a = e[n];
              (a.enumerable = a.enumerable || !1),
                (a.configurable = !0),
                "value" in a && (a.writable = !0),
                Object.defineProperty(t, r(a.key), a);
            }
          }
          (t.exports = function (t, e, n) {
            return (
              e && a(t.prototype, e),
              n && a(t, n),
              Object.defineProperty(t, "prototype", {
                writable: !1,
              }),
              t
            );
          }),
            (t.exports.__esModule = !0),
            (t.exports.default = t.exports);
        },
        ,
        function (t, e) {
          function n(e) {
            return (
              (t.exports = n =
                "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                  ? function (t) {
                      return typeof t;
                    }
                  : function (t) {
                      return t &&
                        "function" == typeof Symbol &&
                        t.constructor === Symbol &&
                        t !== Symbol.prototype
                        ? "symbol"
                        : typeof t;
                    }),
              (t.exports.__esModule = !0),
              (t.exports.default = t.exports),
              n(e)
            );
          }
          (t.exports = n),
            (t.exports.__esModule = !0),
            (t.exports.default = t.exports);
        },
        ,
        function (t, e, n) {
          var r = n(3).default,
            a = n(6);
          (t.exports = function (t) {
            var e = a(t, "string");
            return "symbol" === r(e) ? e : String(e);
          }),
            (t.exports.__esModule = !0),
            (t.exports.default = t.exports);
        },
        function (t, e, n) {
          var r = n(3).default;
          (t.exports = function (t, e) {
            if ("object" !== r(t) || null === t) return t;
            var n = t[Symbol.toPrimitive];
            if (void 0 !== n) {
              var a = n.call(t, e || "default");
              if ("object" !== r(a)) return a;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return ("string" === e ? String : Number)(t);
          }),
            (t.exports.__esModule = !0),
            (t.exports.default = t.exports);
        },
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        function (t, e, n) {
          "use strict";
          n.r(e);
          var r = n(0),
            a = n.n(r),
            i = n(1),
            o = n.n(i);
          n(18);
          var s = (function () {
              function t() {
                a()(this, t);
              }
              return (
                o()(t, null, [
                  {
                    key: "isMac",
                    value: function () {
                      var t = !0;
                      return (
                        ("Win32" != navigator.platform &&
                          "Windows" != navigator.platform) ||
                          (t = !1),
                        t
                      );
                    },
                  },
                  {
                    key: "isAndroid",
                    value: function () {
                      var t = navigator.userAgent,
                        e = !1;
                      return (
                        (t.indexOf("Android") > -1 || t.indexOf("Linux") > -1) &&
                          (e = !0),
                        e
                      );
                    },
                  },
                  {
                    key: "isPC",
                    value: function () {
                      for (
                        var t = navigator.userAgent,
                          e = [
                            "Android",
                            "iPhone",
                            "SymbianOS",
                            "Windows Phone",
                            "iPad",
                            "iPod",
                          ],
                          n = !0,
                          r = 0;
                        r < e.length;
                        r++
                      )
                        if (t.indexOf(e[r]) > 0) {
                          n = !1;
                          break;
                        }
                      return n;
                    },
                  },
                  {
                    key: "isIOS",
                    value: function () {
                      return !!navigator.userAgent.match(
                        /\(i[^;]+;( U;)? CPU.+Mac OS X/
                      );
                    },
                  },
                ]),
                t
              );
            })(),
            l = (function () {
              function t() {
                a()(this, t);
              }
              return (
                o()(t, null, [
                  {
                    key: "forbidScroll",
                    value: function () {
                      var t = {
                        position: "fixed",
                        width: "100%",
                        top: "-" + $(window).scrollTop() + "px",
                      };
                      $("body").css(t);
                    },
                  },
                  {
                    key: "recoveryScroll",
                    value: function () {
                      var t = $("body");
                      t.css("position", "static"),
                        $("html,body").animate(
                          {
                            scrollTop: -parseFloat(t.css("top")),
                          },
                          0
                        );
                    },
                  },
                ]),
                t
              );
            })();
          function u() {
            for (
              var t = document.getElementsByClassName("listing"),
                e = t[0].getElementsByClassName("arr"),
                n = t[1].getElementsByClassName("arr"),
                r = document.getElementsByClassName("cell"),
                a = r[0].getElementsByClassName("side-box"),
                i = r[1].getElementsByClassName("side-box"),
                o = 0;
              o < a.length;
              o++
            ) {
              var s = e[o].dataset.cur;
              "true" == s
                ? a[o].classList.add("current")
                : "false" == s && a[o].classList.remove("current");
            }
            for (var l = 0; l < i.length; l++) {
              var u = n[l].dataset.cur;
              "true" == u
                ? i[l].classList.add("current")
                : "false" == u && i[l].classList.remove("current");
            }
          }
          function c() {
            for (
              var t = document.getElementsByClassName("listing"),
                e = t[0].getElementsByClassName("arr"),
                n = t[1].getElementsByClassName("arr"),
                r = document.getElementsByClassName("cell"),
                a = r[0].getElementsByClassName("side-box"),
                i = r[1].getElementsByClassName("side-box"),
                o = 0;
              o < a.length;
              o++
            ) {
              var s = e[o].dataset.cur;
              "true" == s
                ? (a[o].classList.add("current"), d(a[o], e[o]))
                : "false" == s && a[o].classList.remove("current");
            }
            for (var l = 0; l < i.length; l++) {
              var u = n[l].dataset.cur;
              "true" == u
                ? (i[l].classList.add("current"), d(i[l], n[l]))
                : "false" == u && i[l].classList.remove("current");
            }
          }
          function d(t, e) {
            var n = e.parentNode;
            n.lastChild == e ? n.appendChild(t) : n.insertBefore(t, e.nextSibling);
          }
          $(function () {
            $(document)
              .on("click", function () {
                $("#header").find(".droplist").hide();
              })
              .on("click", 'div[data-handle="headerDroplist"]>span', function (t) {
                t.stopPropagation(),
                  $(this).closest("div").siblings().find(".droplist").hide(),
                  $(this).siblings(".droplist").toggle();
              })
              .on("click", 'span[data-handle="mobileMenu"]', function () {
                $(this).siblings(".mobile-menu-content").show(), l.forbidScroll();
              })
              .on("click", 'div[data-handle="mobileClose"]', function () {
                $(this).closest(".mobile-menu-content").hide(), l.recoveryScroll();
              })
              .on("click", 'a[data-handle="mobileMore"]', function () {
                var t = $(this).closest("li");
                "true" == t.attr("data-active")
                  ? t.attr("data-active", "false").find(".mobile-menu-min").hide()
                  : (t
                      .siblings("li")
                      .attr("data-active", "false")
                      .find(".mobile-menu-min")
                      .hide(),
                    t.attr("data-active", "true").find(".mobile-menu-min").show());
              }),
              $(window).scroll(function () {
                $("#header").find(".droplist").hide();
              });
          }),
            s.isPC()
              ? $(document)
                  .on("mouseenter", "#list, .cell .listing .arr", function () {
                    $(this)
                      .attr("data-cur", "true")
                      .siblings()
                      .attr("data-cur", "false"),
                      u();
                  })
                  .on("mouseleave", "#list", function () {
                    $(this).attr("data-cur", "false"),
                      $(this).find(".arr").attr("data-cur", "false"),
                      u();
                  })
                  .on("mouseenter", "#list, .cell .listing a", function () {
                    $(this).hasClass("li") ||
                      $(this).closest(".listing").find("a").attr("data-cur", "false"),
                      u();
                  })
              : ($(document).on("click", "#btn", function () {
                  var t = $(".nav");
                  $('[data-handle="btnMenu"]').hasClass("close") &&
                    (BgScroll.recoveryScroll(),
                    t.hide(),
                    $('[data-handle="btnMenu"]').removeClass("close"),
                    $(".header").removeClass("m-header-fixed"));
                  var e = !0,
                    n = $(this).attr("href"),
                    r = n.substring(1, n.length);
                  return (
                    e
                      ? ($("html, body").animate(
                          {
                            scrollTop: $("#" + r).offset().top - 64,
                          },
                          0
                        ),
                        setTimeout(function () {
                          $("html, body").animate(
                            {
                              scrollTop: $("#" + r).offset().top - 64,
                            },
                            0
                          );
                        }, 100),
                        (e = !1))
                      : $("html, body").animate(
                          {
                            scrollTop: $("#" + r).offset().top - 64,
                          },
                          0
                        ),
                    !1
                  );
                }),
                $(".cell .listing .li").attr("href", "javascript:;"),
                $(document)
                  .on("click", '[data-handle="openBox"]', function () {
                    "true" !== $(this).attr("data-cur")
                      ? ($(this)
                          .siblings(".content")
                          .slideDown()
                          .parent("li")
                          .attr("data-cur", "true")
                          .siblings()
                          .attr("data-cur", "false")
                          .find(".content")
                          .slideUp(),
                        $(this)
                          .attr("data-cur", "true")
                          .siblings()
                          .show()
                          .parent("li")
                          .attr("data-cur", "true")
                          .siblings()
                          .find('[data-handle="openBox"]')
                          .attr("data-cur", "false"),
                        c())
                      : ($(this)
                          .attr("data-cur", "false")
                          .parent("li")
                          .attr("data-cur", "false"),
                        $(this)
                          .siblings(".content")
                          .slideUp()
                          .find(".cell .listing .arr")
                          .attr("data-cur", "false")
                          .find(".side-box")
                          .slideUp(),
                        c());
                  })
                  .on("click", ".cell .listing .arr", function () {
                    "true" !== $(this).attr("data-cur")
                      ? ($(this)
                          .find(".side-box")
                          .slideDown()
                          .parent(".cell .listing .arr")
                          .siblings()
                          .find(".side-box")
                          .slideUp(),
                        $(this)
                          .attr("data-cur", "true")
                          .siblings()
                          .attr("data-cur", "false"),
                        c())
                      : ($(this).attr("data-cur", "false"),
                        $(this).find(".side-box").slideUp(),
                        c());
                  })),
            $(document).on("click", '[data-handle="btnMenu"]', function () {
              var t = $(".nav");
              $(this).hasClass("close")
                ? (t.hide(),
                  $(this).removeClass("close"),
                  l.recoveryScroll(),
                  $(".header").removeClass("m-header-fixed"))
                : (t.show(),
                  $(this).addClass("close"),
                  l.forbidScroll(),
                  $("body").css("top", 0),
                  $(".header").addClass("m-header-fixed"));
            });
        },
        function (t, e, n) {},
      ]);
    })(jQuery);
