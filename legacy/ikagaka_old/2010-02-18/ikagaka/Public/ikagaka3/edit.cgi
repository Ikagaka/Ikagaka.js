#!/usr/local/bin/perl

# Copyright (c) CGIROOM.   http://cgiroom.nu
#======================================================================#
# [Ver  0.03] �v�����d�c�h�s
#
# ���̃v���O�����ɂ���ċN��������CGIROOM�͐ӔC�𕉂��܂���B
# ���p�_��ɓ��ӂł��Ȃ����̂����p�́A�����������B


#======================================================================#
# �ݒ�

require 'jcode.pl';			# jcode.pl�܂ł̃p�X
$pass = "kokage";			# �`�F�b�N�p�X���[�h
$file[1] = "NaN";
$file[2] = "./index.html";
$file[3] = "./ikagaka/index.html";
$file[4] = "./ikagaka/ikagaka.js";
$file[5] = "./ikagaka/named.js";
$file[6] = "./ikagaka/ghost.js";
$file[7] = "./ikagaka/shell.js";
$file[8] = "./ikagaka/balloon.js";
$file[9] = "./ikagaka/scope.js";
$file[10] = "./ikagaka/shiori.js";
$file[11] = "./ikagaka/other.js";

$file[13] = "./ikagaka/jquery.cleaner.js";
$file[14] = "./edit.cgi";
$file[15] = "./edit2.cgi";

#======================================================================#
print "Content-type: text/html\n\n";
if($ENV{'REQUEST_METHOD'} eq "POST"){
	read(STDIN, $q, $ENV{'CONTENT_LENGTH'});
}else{
	$q = $ENV{'QUERY_STRING'};
}
@q = split(/&/,$q);
foreach (@q){
	($n,$v)=split(/=/);
	$v =~ tr/+/ /;
	$v =~ s/%([a-fA-F0-9][a-fA-F0-9])/pack("C", hex($1))/eg;
	$v =~ s/\r\r\n/\n/g;
	$v =~ s/\r\n/\n/g;
	$v =~ s/\r/\n/g;
	$FORM{$n} = "$v";
}
undef @q;
undef $q;
$code="";
@kai_s[1..4]=("\r\r\n","\r\n","\r","\n");
if($FORM{'pass'} eq $pass){
	print'<form method="POST" action="edit.cgi">';
	print"�ҏW�\\�t�@�C��:<input type=\"hidden\" name=\"pass\" value=\"$FORM{'pass'}\">";
	print'<select name="name" size="1">';
	foreach $n (1..$#file){
		next if $file[$n] eq "";
		print"<option value=\"$n\">$file[$n]</option>\n";
	}
	print'</select><input type="submit" value="�ҏW"></form>';
	unless($FORM{'name'}){
		foreach $n (1..$#file){
			if($file[$n] ne ""){
				$FORM{'name'} = $n;
				last;
			}
		}
	}
	if($FORM{'s'}){
		$v = $FORM{'file'};
		undef $FORM{'file'};
		&jcode'convert(*v,$FORM{'code'}) if $FORM{'code'} ne "";
		$v=~ s/\n/$kai_s[$FORM{'kai'}]/g if $FORM{'kai'};
		open(O,">$file[$FORM{'name'}]") || &error('�ۑ��ł��܂���',__LINE__);
		binmode(O);
		print O $v;
		close(O);
		undef $v;
	}
	open(O,"$file[$FORM{'name'}]") || &error("$file[$FORM{'name'}]�t�@�C�����J���܂���",__LINE__);
	binmode(O);
	while(<O>){
		if($FORM{'kai'}){
		}elsif(/\r\r\n/){
			$FORM{'kai'}=1;
		}elsif(/\r\n/){
			$FORM{'kai'}=2;
		}elsif(/\r/){
			$FORM{'kai'}=3;
		}elsif(/\n/){
			$FORM{'kai'}=4;
		}
		$v=$_;
		$code = &jcode'getcode(*v);
		last if $code ne "";
	}
	close(O);
	$FORM{'code'}=$code;
	$size=(stat($file[$FORM{'name'}]))[7];
	$size="0" if $size < 1;
	$kai_v=$kai_s[$FORM{'kai'}];
	$kai_v=~ s/\r/\\r/g;
	$kai_v=~ s/\n/\\n/g;
	print <<HTML;
	<body bgcolor="#FFFFFF">
	<form method="POST" action="edit.cgi">
	<input type="hidden" name="pass" value="$FORM{'pass'}">
	<input type="hidden" name="name" value="$FORM{'name'}">
	<hr><table border="0">
	<tr><td align="right" bgcolor="#CCCCCC">�v�����d�c�h�s:</td><td>Ver  0.03</td>
	    <td align="right" bgcolor="#CCCCCC">�h�o:</td><td>$ENV{'REMOTE_ADDR'}</td></tr>
	<tr><td align="right" bgcolor="#CCCCCC">�t�@�C����:</td><td>$file[$FORM{'name'}]</td>
	    <td align="right" bgcolor="#CCCCCC">�T�C�Y:</td><td>$size b</td></tr>
	<tr><td align="right" bgcolor="#CCCCCC">�����R�[�h:</td><td><select name="code" size="1"><option>$FORM{'code'}</option><option value="">-------</option><option>euc</option><option>sjis</option><option>jis</option></select></td>
	    <td align="right" bgcolor="#CCCCCC">���s�R�[�h:</td><td><select name="kai" size="1"><option value="$FORM{'kai'}">$kai_v</option><option value="">-------</option><option value="1">\\r\\r\\n</option><option value="2">\\r\\n</option><option value="3">\\r</option><option value="4">\\n</option></select></td></tr>
	<tr><td align="right" bgcolor="#CCCCCC">�ۑ�</td><td><input type="submit" name="s" value="S a v e"></td>
	    <!--<td align="right" bgcolor="#CCCCCC">�߂�</td><td><input type="reset" value="R e s e t"></td>--></tr>
	</table>
	<textarea name="file" rows="35" cols="150">
HTML
	open(O,"$file[$FORM{'name'}]") || &error("$file[$FORM{'name'}]�t�@�C�����J���܂���",__LINE__);
	while(<O>){
		$v="$_";
		$v =~ s/\r\r\n/\n/g;
		$v =~ s/\r\n/\n/g;
		$v =~ s/\r/\n/g;
		&jcode'convert(*v,'sjis');
		$v=~ s/&/&amp;/g;
		$v=~ s/</&lt;/g;
		$v=~ s/>/&gt;/g;
		$v=~ s/"/&quot;/g;
		print $v;
	}
	close(O);
	print"</textarea><br>\n";
	print<<HTML;
	</form>
	<!--
	<hr>
	�v�����d�c�h�s<br>
	<a href="http://cgiroom.nu">Copyright (C) CGIROOM</a>
	-->
HTML
}else{
	$FORM{'pass'}=~ s/["&<>]//g;
	print <<HTML;
<html>
	<body bgcolor="#FFFFFF">
	<table width="100%" height="100%">
		<form method="POST" action="edit.cgi">
		<tr>
		<td align="center">
			WebEDIT system<p>
			PASSWORD:<input type="input" size="20" name="pass" value="$FORM{'pass'}"><input type="submit" value="OK">
			<hr><a href="http://cgiroom.nu">Copyright (C) CGIROOM</a>
		</td>
		</tr>
		</form>
	</table>
	</body>

</html>
HTML
}
exit;
sub error{
	print"<h1>ERROR</h1>$_[0]<br>line $_[1].<hr>Copyright (C) CGIROOM";
	exit;
}

__END__

�X�V����

1999/07/16 Ver  0.02
1999/08/04 Ver  0.03
