<?php
while (true) {
    $text = file_get_contents("http://en.wikipedia.org/w/index.php?title=Special:Random&printable=yes");
    preg_match_all('/<title>(.+?)<\/title>/', $text, $title);
    preg_match_all('/<p>(.+?)<\/p>/', $text, $paras);


    $title = strip_tags($title[0][0]);
    $paras = $paras[0];
    if (count($paras) < 3)
        continue;
    $paras = array_slice($paras, 0, 2);

    $para = strip_tags(implode(' ', $paras));
    $ret = array(title => $title, paras => $para);
    echo json_encode($ret);
    break;
}
?>
