
require(['require.config'],()=>{
    require(['jquery','url','template','header'],($,url,template)=>{
        class Cart{
            constructor(){
               
                this.getData();
                this.init(); 
                this.cart();
                this.calcAll();
                this.calcMoney();
            }
            
            cart(){
                
                let cart = localStorage.getItem('cart');
                cart = JSON.parse(cart);
                if(cart==''||cart==undefined){
                      
                    $('#button').css('background',"#ccc");
                    $('#choose-all').hide();
                    $('.all').css('color','#ccc');  
                    $('#cart-container-top-before').show();
                    $('#cart-container-top-after').hide();
                    $('#edit-btn').hide();
                }
            }
            //渲染购物车数据
            init(){
                let cart = localStorage.getItem('cart');
               
                if(cart){
                    cart = JSON.parse(cart);
                     this.load(cart); 
                     this.calcAll();
                     this.calcMoney();
                    $('#cart-container-top-before').hide();
                    $('#cart-container-top-after').show();
                    $('#edit-btn').show();
                    $('.delete').hide();
                    $('#ok-btn').hide();
                    $('.choose').attr('checked','true');
                    $('#choose-all').attr('checked','true');
                    
                    //给编辑按钮添加点击事件
                    $('#edit-btn').on('click',()=>{
                    $('.delete').show();
                        $('#ok-btn').show();
                        $('#edit-btn').hide();
                        $('#cart-container-top-after').animate({left:-50});
                        //点击编辑按钮后，给删除添加事件
                        let _this =this;
                        $('#cart-container-top-after').on('click','.delete',function(){
                            let id = $(this).prev('.right').prev('.left').find('a').attr('href').split('?')[1].slice(3);
                            if(confirm('确定删除该商品吗？')){
                                $('#toast').show();
                                setTimeout(function(){
                                    $('#toast').hide();
                                },2000)
                                $(this).prev('.right').prev('.left').remove(); 
                                $(this).prev('.right').remove();
                                 $(this).remove();//移除删除按钮
                                
                                 //从localstorage中删除选中的商品，以id为标准
                                 let car = $.grep(cart,function(shop,i){
                                     //返回的是id不相等的（就相当于删除选中的id的商品）
                                    return shop.id!=id;
                                },false)
                                 localStorage.setItem('cart',JSON.stringify(car));
    
                                 cart = JSON.parse(localStorage.getItem('cart'));
                                 _this.calcAll();
                                 _this.calcMoney();
                            } 
                            
            
                             let key=JSON.parse(localStorage.getItem("cart"));
                             if(key==undefined||key==''){
                                 $('#cart-container-top-after').hide();
                                 $('#cart-container-top-before').show();
                                 $('#button').css('background',"#ccc");
                                 $('#choose-all').hide();
                                 $('.all').css('color','#ccc');
                                 $('#ok-btn').hide();
                                 $('#edit-btn').hide();  
                             }
                           _this.calcAll();
                           _this.calcMoney();                          
                        })
                        
                    })
                    //给完成按钮添加点击事件
                    $('#ok-btn').on('click',function(){
                        $('#ok-btn').hide();
                        $('#edit-btn').show();
                         $('#cart-container-top-after').animate({left:0});
                          $('.delete').hide();
                          _this.calcAll();
                          _this.calcMoney()
                          
                          
                        })
                    //事件委托,在购物车界面中增加或者减少数量。
                    let _this =this;
                    //加减事件委托
                    $('#cart-container-top-after').on('click','span',function(){
                        let num = $(this).siblings('.num').html();
                        if($(this).attr('class')==='add'){
                           num++;
                           console.log(1)
                           $(this).siblings('.num').html(num);
                         
                        }else if($(this).attr('class')==='sub'){
                            num--;
                            if(num<1){
                                num=1;
                                
                            }
                            $(this).siblings('.num').html(num);
                          
                            
                        }
                        //获取事件源的id
                         let id = $(this).parent('.right').prev('.left').find('a').attr('href').split('?')[1].slice(3);
                        //遍历cart，找到与事件源相同的id
                         cart.forEach((shop,index) => {
                             if(shop.id==id){
                                  shop.num = num;  
                                 localStorage.setItem('cart',JSON.stringify(cart));
                             }
                         });
                          _this.calcAll();
                          _this.calcMoney();
                         
                    }) 
                    
                   
                    this.bindEvents();
                   
                    
                
              }  //localstorge不存在
                else{
                   
                    $('#cart-container-top-after').hide();
                    $('#cart-container-top-before').show();
                    $('#edit-btn').hide();
                    $('#ok-btn').hide();
                    $('#delete').hide();
                   
                
            }
        }
            //从localstorage里面渲染购物车
            load(cart){
                //渲染购物车栏的数据
                let car = template('cart-template',{cart});
                $('#cart-container-top-after').html(car);
                //渲染去结算栏数据
                this.calcAll();
                this.calcMoney();
                
            } 
            //计算总的数量
            calcAll(){
                let cart = localStorage.getItem('cart');
                if(cart){

                
                let cart = localStorage.getItem('cart');
                cart = JSON.parse(cart);
               
                let allNum = cart.reduce((num,shop,i)=>{
                   
                    let arr =  $('#cart-container-top-after').find('.left').get(i);
                    
                  
                    let choose = arr.querySelector(".choose");
                   
                 
                    if(choose.checked){
                        num += shop.num;
                        return num;
                    }
                    return num;
                      
                },0)
                
                // console.log(allNum);
                $('#all-shop').html(allNum);
            }}
            //计算总的价钱
            calcMoney(){
                let cart = localStorage.getItem('cart');
                if(cart){

                
                let cart = localStorage.getItem('cart');
                cart = JSON.parse(cart);
                // let arr =  $('#cart-container-top-after').find('.left').get();
                
                 let money = cart.reduce((price,shop,i)=>{
                     
                    let arr =  $('#cart-container-top-after').find('.left').get(i);
                    let chooses = document.querySelectorAll('.choose')
                    
                    this.choose =  Array.from(chooses);
                    
                   if(this.choose[i].checked){
                    price += shop.num*shop.price;
                    return price;
                   }
                   return price;
                    
                   
                 },0)
                 let allPrice = money.toFixed(2);
              
                $('#money').html(allPrice);
            }}
            //推荐板块渲染数据
            getData(){
                $.get(url.rapBaseUrl+"cart/recommend",data=>{
                    if(data.res_code==1){
                        this.render(data.res_body.list);
                    }
                })
            }
            render(list){
                let cart = template('cart-recommend',{list});
                $('#index-recommend-list').html(cart);
            }
            
            
            //点击复选框的事件
            bindEvents(){
                let _this = this;
                //点击全选按钮
                $('#choose-all').on('click',function(){

                    
                    if($(this).is(':checked')){
                        $('.choose').prop('checked',true);
                        _this.calcAll();
                        _this.calcMoney();
                        $('#all').css('color','')
                        $('#button').css('background',"#7f0019");
                         $('#button').attr('disabled',true)
                    }else{
                        $('.choose').prop('checked',false);
                        _this.calcAll();
                        _this.calcMoney();
                        $('#all').css('color','#ccc')
                        $('#button').css('background',"#ccc");
                       
                    }  
                })
               
                
              
              
                //点击每个单选框的事件
            
                 $('#cart-container-top-after').on('click','.choose',function(){
                    _this.calcMoney();
                    _this.calcAll();
                    _this.allCheck();

                 })
                  //全选与单选链接
                 
            }
            allCheck(){
                let count = 0;
                this.choose.forEach((item,index)=>{
                    if(item.checked){
                        count++;
                        $('#all').css('color','#ccc')
                        $('#button').css('background',"#7f0019");
                     }

                })
                if(this.choose.length === count){
                    $('#all').css('color','')
                    $('#choose-all').prop('checked',true);
                    $('#button').attr('disabled',true)
                }else{
                    
                    $('#choose-all').prop('checked',false);
                   
                }if(count==0){
                    $('#all').css('color','#ccc')
                    $('#button').css('background',"#ccc");
                    
                }
            }
         
          
        }
        new Cart();
    })
})



