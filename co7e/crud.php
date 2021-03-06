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

    error_reporting(0);

    if (session_status() === PHP_SESSION_NONE) session_start();

    $dataset = [];

    $mysqli = new mysqli(MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DB);

    // if ($mysqli->connect_errno) {}

    $mysqli->set_charset(MYSQL_CHARSET);

    foreach ($_POST as $name => $value) $query = preg_replace("/P\{$name\}/", $mysqli->real_escape_string($value), $query);
    
    foreach ($_GET as $name => $value) $query = preg_replace("/G\{$name\}/", $mysqli->real_escape_string($value), $query);

    foreach ($_SESSION as $name => $value) $query = preg_replace("/S\{$name\}/", $mysqli->real_escape_string($value), $query);

    if ($pass = $mysqli->multi_query($query)) {
        do {
            if ($result = $mysqli->store_result()) {
                array_push($dataset, $result->fetch_all(MYSQLI_ASSOC));
                $result->free();
            } else {
                array_push($dataset, $mysqli->affected_rows);
            }
        } while ($pass = $mysqli->next_result());
    }

    $mysqli->close();
?>