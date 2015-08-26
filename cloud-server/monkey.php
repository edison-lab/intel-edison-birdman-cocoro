<?php
  
  
  $input_binary = file_get_contents("php://input");

  //google speech
  $APIKEY = '***********';
  $requestUrl = 'https://www.google.com/speech-api/v2/recognize?output=json&client=chromium&maxresults=1&lang=ja&key='.$APIKEY;
  $lang = 'ja-jp';
  $output  'json';
  $contentType = 'Content-Type: audio/l16; rate=16000;';
  $curl=curl_init($requestUrl);
  curl_setopt($curl,CURLOPT_POST, TRUE);
  curl_setopt($curl,CURLOPT_HTTPHEADER, array($contentType));
  curl_setopt($curl,CURLOPT_POSTFIELDS, $input_binary);
  curl_setopt($curl,CURLOPT_SSL_VERIFYPEER, FALSE);
  curl_setopt($curl,CURLOPT_SSL_VERIFYHOST, FALSE); 
  curl_setopt($curl,CURLOPT_RETURNTRANSFER, TRUE);
  curl_setopt($curl,CURLOPT_FOLLOWLOCATION, TRUE); 
  $output = curl_exec($curl);

  // parse JSON
  $obj = json_decode($output, true);
  $result_speech = $obj['result'][0]['alternative'][0]['transcript'];
  echo $result_speech;

  $json = file_get_contents('./profile/monkey.json');
  $arr = json_decode($json, true);

  $answer = '';

  if(strpos($result_speech, 'はじめまして') !== false ) $answer = $arr['HAJIMEMASHITE'];
  else if(strpos($result_speech, 'おはよ') !== false) $answer = $arr['OHAYO'];
  else if(strpos($result_speech, 'こんにちは') !== false) $answer = $arr['KONNICHIWA'];
  else if(strpos($result_speech, 'ばいばい') !== false) $answer = $arr['BYEBYE1'];
  else if(strpos($result_speech, 'さよなら') !== false) $answer = $arr['BYEBYE2'];
  else if(strpos($result_speech, 'さようなら') !== false) $answer = $arr['BYEBYE3'];
  else if(strpos($result_speech, 'ありがと') !== false) $answer = $arr['ARIGATO'];
  else if(strpos($result_speech, '名前') !== false) $answer = $arr['NAME'];
  else if(strpos($result_speech, '性別') !== false) $answer = $arr['SEX'];
  else if(strpos($result_speech, '年齢') !== false) $answer = $arr['AGE'];
  else if(strpos($result_speech, '何歳') !== false) $answer = $arr['AGE'];
  else if(strpos($result_speech, '出身') !== false) $answer = $arr['COME_FROM'];
  else if(strpos($result_speech, '誕生日') !== false) $answer = $arr['BIRTHDAY'];
  else if(strpos($result_speech, '血液型') !== false) $answer = $arr['BLOOD'];
  else if(strpos($result_speech, '趣味') !== false) $answer = $arr['HOBBY'];
  else if(strpos($result_speech, '特技') !== false) $answer = $arr['SKILL'];
  else if(strpos($result_speech, '夢') !== false) $answer = $arr['DREAM'];
  else if(strpos($result_speech, 'フェチ') !== false) $answer = $arr['FETISH'];
  else if(strpos($result_speech, 'インテル') !== false) $answer = $arr['INTEL'];
  
  if($answer == '') {

    // simsimi API
    $api_key = '***********';
    $result_speech_encode = urlencode($result_speech);
    $api_url = 'http://sandbox.api.simsimi.com/request.p?key='.$api_key.'&lc=ja&ft=1.0&text='.$result_speech_encode;
    $res = file_get_contents($api_url);

    if(strpos($res, '"result":400') === false) { 
      $first = strrpos ( $res , "se\":\"" )+5;
      $last = strrpos ( $res , "\",\"id\"" )-$first;
      $answer = substr( $res, $first, $last);
    } else { // SimSimi or googlespeech error
      $input = array(
        'もう少し近づいてしゃべってください','ごめんなさい、もう少し近くでしゃべれますか？','マイクのすぐそばでしゃべってください'
      );
      $rand_keys = rand(0, 2);
      $answer = $input[$rand_keys];
    } 

    $search = array('私','わたし','ワタシ','僕','ぼく','ボク','俺','おれ','オレ','ウチ','自分');
    $answer = str_replace($search,'拙者',$answer);
    $search = array('\n','です','だよ','*');
    $answer = str_replace($search,'',$answer);
    $answer = $answer.'でござる';

  }

  $xml = '<?xml version="1.0" encoding="utf-8" ?><speak version="1.1"><voice name="koutarou"><prosody rate="0.9" pitch="0.5" range="2.0" volume="2.0">'.$answer.'</prosody></voice></speak>';
  $url = 'https://api.apigw.smt.docomo.ne.jp/aiTalk/v1/textToSpeech?APIKEY=394d5258537052766a52586a697836365a734c5a426a59596c325871456730337133684863324964617a38';  
  $headers = array(
    'Content-Type:application/ssml+xml',
    'Accept:audio/L16',
    'Content-Length:'.sprintf('%d',strlen($xml))
  );
  $stream = stream_context_create(array('http' => array(
        'method' => 'POST',
        'header' => implode('\r\n',$headers),
        'content' => $xml
      )));
  $outputpath = 'output_dialogue_a.raw';

  $a = file_get_contents($url, false, $stream);
  file_put_contents($outputpath, $a);

  echo $answer;

?>