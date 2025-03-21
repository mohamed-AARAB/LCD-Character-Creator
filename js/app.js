var codeTemplate = "";
codeTemplate += "#include &lt;unistd.h&gt;\n";
codeTemplate += "\n";
codeTemplate += "uint8_t customChar[] = {\n";
codeTemplate += "  {DataX0}, {DataX1}, {DataX2}, {DataX3}, {DataX4}\n";
codeTemplate += "};\n";

function binaryToHex(s) {
    var i, k, part, accum, ret = '';
    for (i = s.length-1; i >= 3; i -= 4) {
        // extract out in substrings of 4 and convert to hex
        part = s.substr(i+1-4, 4);
        accum = 0;
        for (k = 0; k < 4; k += 1) {
            if (part[k] !== '0' && part[k] !== '1') {
                // invalid character
                return { valid: false };
            }
            // compute the length 4 substring
            accum = accum * 2 + parseInt(part[k], 10);
        }
        if (accum >= 10) {
            // 'A' to 'F'
            ret = String.fromCharCode(accum - 10 + 'A'.charCodeAt(0)) + ret;
        } else {
            // '0' to '9'
            ret = String(accum) + ret;
        }
    }
    // remaining characters, i = 0, 1, or 2
    if (i >= 0) {
        accum = 0;
        // convert from front
        for (k = 0; k <= i; k += 1) {
            if (s[k] !== '0' && s[k] !== '1') {
                return { valid: false };
            }
            accum = accum * 2 + parseInt(s[k], 10);
        }
        // 3 bits, value cannot exceed 2^3 - 1 = 7, just convert
        ret = String(accum) + ret;
    }
    return { valid: true, result: ret };
}

reloadData = function() {
	$("[name='datatype']").each(function(index, element) {
        if ($(this).is(":checked")) type = $(this).val();
    });
	var Data = [];
	for (var y=0;y<=4;y++) {
		var BinStr="";
		for (var x=0;x<=7;x++) {
			if ($(".dot-px[data-x='" + x + "'][data-y='" + y + "']").attr("class").indexOf("high")>=0) {
				BinStr = "1" + BinStr;
			} else {
				BinStr = "0" + BinStr;
			}
		}
		Data[y] = type == "hex" ? "0x" + binaryToHex(BinStr)['result'] : "B" + BinStr;
	}

	var html= codeTemplate;
	for (var i=0;i<=4;i++) {
		html = html.replace("{DataX" + i + "}", Data[i]);
	}
	$("#code-box").html(html);
	Prism.highlightAll();
}

$(document).ready(function(e) {
    $(".dot-px").click(function(e) {
        if ($(this).attr("class").indexOf("high")>=0) {
          $(this).removeClass("high");
		} else {
          $(this).addClass("high");
        }
		reloadData();
    });
	
	$("[name='color']").change(function(e) {
        $(".box-char").removeClass("green").removeClass("blue").addClass($(this).val());
    });
	
	$("[name='datatype'], [name='interfacing']").change(function(e) {
        reloadData();
    });
	
	$("#clear").click(function(e) {
		for (var x=0;x<=7;x++) {
			for (var y=0;y<=4;y++) {
				$(".dot-px[data-x='" + x + "'][data-y='" + y + "']").removeClass("high");
			}
		}
        reloadData();;
    });
	
	$("#invert").click(function(e) {
		for (var x=0;x<=7;x++) {
			for (var y=0;y<=4;y++) {
				if ($(".dot-px[data-x='" + x + "'][data-y='" + y + "']").attr("class").indexOf("high")>=0)
					$(".dot-px[data-x='" + x + "'][data-y='" + y + "']").removeClass("high");
				else
					$(".dot-px[data-x='" + x + "'][data-y='" + y + "']").addClass("high");
			}
		}
        reloadData();;
    });
	
	reloadData();
});
