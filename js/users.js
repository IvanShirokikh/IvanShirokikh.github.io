//Функция, реагирующая на кнопку и Enter(Главная функция)
function find(){
    //Скрытие контента
    $('#content').hide();
    //Показ анимации загрузки
    $('.spinner').show();
    //Стираем старые данные в таблице
    $(".table").empty();
    //Вызов функции получения rss данных
    getRSS($('.form-control').val());
};
//Функция получения новостей
function getRSS(urlFeed) {
    // Формируем query
    var query = "select * from feed where url='"+urlFeed+"' LIMIT 20";
    // Формируем URL для YQL
    var url = "http://query.yahooapis.com/v1/public/yql?q="+encodeURIComponent(query)+"&format=json&callback=?";
    //Получаем JSON данные от YQL
    $.getJSON(url,function(data){
        //Формируем шапку таблицы
        var tableHead = "";
        tableHead += "<thead><tr class='active'><th class='hidden-xs' id='image'>Изображение</th><th id='title'>Заголовок</th>";
        tableHead += "<th id='datePub' class='hidden-xs'>Дата публикации</th><th id='link' class='hidden-xs'>Ссылка</th></tr>";
        tableHead += "<tr class='active visible-xs'><th id='datePub'>Дата публикации</th>";
        tableHead += "<th id='link'>Ссылка</th></tr></thead>";
        //Добавляем шапку
        $('.table').append($(tableHead));
        //Ищем в ответе YQL все элементы item
        $.each(data.query.results.item, function(){
            //Пробуем вызвать функцию парсинга объекта
            try{
                parseRSS(this);
            }
            catch(e){
                alert("Ошибка!");
                return false;
            }
        });
    });
};
//Функция парсинга
function parseRSS(data) {
    var tableBody = "";
    //Парсим объект
    //Получаем значение заголовка
    if(data.title != undefined){
        var title = data.title;
    }
    else
    {
        var title = "Заголовок отсутствует";
    }
    // получаем ссылку
    if(data.link != undefined){
        var link = "<a class='btn btn-default btn-info' role='button' href='" + data.link + "'>Читать</a>";
    }
    else
    {
        var link = "<a class='btn btn-default btn-danger disabled' role='button' href='" + data.link + "'>Ссылка отсутствует</a>";
    }
    // получаем и форматируем дату публикации
    if(data.pubDate != undefined){ //Sun, 19 Feb 2017 03:20:14 +0300
        var pubDate = data.pubDate.replace(/(\w+),\s(\d+)\s(\w+)\s(\d+)\s(\d+):(\d+):(\d+)\s[+](\d+)/, '$2 $3 $4, $1\n$5:$6:$7');
    }
    else
    {
        var pubDate = "Дата публикации отсутствует";
    }
    // получаем значение url изображения
    if(data.enclosure != undefined){
        var img = data.enclosure.url;
    }
    else
    {
        var img = "css/img/alt_foto.png";
    }
    //Формируем тело таблицы
    tableBody += "<tr><td class='hidden-xs'><img src='" + img + "' class='img-responsive img-thumbnail'>";
    tableBody += "</td><td>" + title + "</td><td class='hidden-xs'>" + pubDate + "</td><td class='hidden-xs'>" + link + "</td></tr>";
    tableBody += "<tr class='visible-xs'></td><td>" + pubDate + "</td><td>" + link + "</td></tr>";
    //Добавление данных
    $('.table').append($(tableBody));
    //Показ анимации загрузки
    $('.spinner').hide();
    //Скрытие контента
    $('#content').show();
};