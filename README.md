Yet another javascript fuzzy string matching library!

We use this in the Superhuman email client in autocompletion contexts where the set of results is relatively bounded, and we want to allow for considerable fuzziness in the matching. See also [trieing](https://github.com/superhuman/trieing), which is used when the set is unbounded or when metrics other than matchiness are most important.

# Installation

```
npm install command-score
```

# Usage

```
var commandScore = require('command-score');

function getMatches (query) {

    var items = ["red", "green", "gold", blue"];
    var results = [];

    items.forEach(function (item) {
        var score = commandScore(item, query)
        if (score > 0) {
            results.push({score: score, item: item});
        }
    })
    return results.sort(function (a, b) {
        if (a.score === b.score) {
            return a.item.localeCompare(b.item);
        }
        return b.score - a.score;
    }).map(function (suggestion) {
        return suggestion.item;
    });

}
```

# Behaviour

Given a query and a string to match against, returns a matchiness score designed to sort strings by how likely the user is to want the string given the query. The scores are scaled between 0 and 1, and are only designed to be comparable if you keep the query the same and compare the scores against different strings (or, but less usefully, keep the string the same and try different queries).

Care is taken to reduce artificial differences in matchiness scores, so that many strings may end up having the same score for a given query. This lets us use a secondary sort on top of matchiness.

* The score will be 0 if the user types characters in the query that are not in the string,
* The score will be 1 if the query and the string match exactly.
* The score will be multiplied by 0.9999 for each case-mismatch. (i.e. if you type "html", you are very likely to mean "HTML", but not as likely as if you typed "HTML").
* The score will be multiplied by 0.99 if the user typed a prefix of the real word (i.e. if you type "lo" you are equally likely to mean "loch" or "lodgings").
* The score will be multiplied by ~0.9 for each word-jump mid query. (i.e. if you type "ln" you are approximately 90% likely to mean "loch ness")
* The score will be multiplied by ~0.3 for each character-jump mid query (i.e. if you type "lch" you are about 30% likely to mean "loch")
* The score will be multiplied by 0.1 for each transposition of characters. (i.e. if you type "htlm" instead of "html" you are 10% as likely to mean "html")
* The score will be multiplied by 0.01 for each long-jump mid-query (i.e. if you type "le" you are about 1% likely to mean loch ness).

In each of the word-jump, character-jump, and long-jump cases, a further small penalty is added so that shorter jumps are considered more matchy.

# See also

* The original version of this code: https://github.com/rapportive-oss/jquery.fuzzymatch.js
* FilePathScoreFunction https://chromium.googlesource.com/chromium/blink/+/master/Source/devtools/front_end/sources/FilePathScoreFunction.js
* fzy            https://github.com/jhawthorn/fzy
* FuzzAldrin     https://github.com/atom/fuzzaldrin
*  LiquidMetal    http://github.com/rmm5t/liquidmetal/blob/master/liquidmetal.js
* quicksilver.js http://code.google.com/p/rails-oceania/source/browse/lachiecox/qs_score/trunk/qs_score.js
* QuickSilver    http://code.google.com/p/blacktree-alchemy/source/browse/trunk/Crucible/Code/NSString_BLTRExtensions.m#61
* FuzzyString    https://github.com/dcparker/jquery_plugins/blob/master/fuzzy-string/fuzzy-string.js
* Fuzzy.js       https://github.com/bripkens/fuzzy.js
* Fuse.js        http://kiro.me/projects/fuse.html
