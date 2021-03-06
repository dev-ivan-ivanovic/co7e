<?php
/******************************************************************************
MIT License

The "co7e" is open-source, full stack Single Page Application(SPA) web framework with focus on Rapid Application Development(RAD) designed to be practical, lightweight, efficient, fast, secure and easy to learn.

Copyright (c) 2021 Ivan Ivanovic

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
******************************************************************************/

    if (session_status() === PHP_SESSION_NONE) session_start();

    $_SESSION['batch'] = bin2hex(openssl_random_pseudo_bytes(16));

    $m = [];

    foreach ($_FILES as $a => $b) {
        foreach ($b as $c => $d) {
            foreach ($d as $e => $f) {
                $m[$e][$c] = $f;
            }
        } 
    }

    $numUploads = count($m);

    $n = [];

    $RELATIVE_UPLOAD_PATH = RELATIVE_UPLOAD_PATH;
    $ABSOLUTE_UPLOAD_PATH = ABSOLUTE_UPLOAD_PATH;

    foreach ($m as $a) {
        $path_parts = pathinfo($a['name']);
        $ext = '';
        
        if (isset($path_parts['extension'])) $ext = $path_parts['extension'];

        $uploadFilename = bin2hex(openssl_random_pseudo_bytes(16)) . ".$ext";

        if (move_uploaded_file($a['tmp_name'], "{$RELATIVE_UPLOAD_PATH}{$uploadFilename}")) {
            array_push($n, "
            INSERT INTO t_upload 
            (cName, cType, cSize, cUser, cHost, cPath, cBatch)
            SELECT '{$a['name']}', '{$a['type']}', {$a['size']}, 'S{user}', 'S{host}', '{$ABSOLUTE_UPLOAD_PATH}{$uploadFilename}', 'S{batch}'
            FROM t_table_access_control
            WHERE cUser='S{user}' 
            AND cHost='S{host}' 
            AND cTable='t_upload'
            AND cInsert='Y';
            ");
        }
    }
    
    $_SESSION['upload'] = implode(" ", $n);
?>