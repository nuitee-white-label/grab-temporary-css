(function () {                                                                                                            
    var COUNTRY_KEY = 'grab_user_country';
    var DISMISSED_KEY = 'grab_sg_banner_dismissed';

    function getCountry() {
      try { return localStorage.getItem(COUNTRY_KEY); } catch (e) { return null; }
    }                                                                                                                       
  
    function isDismissed() {                                                                                                
      try { return sessionStorage.getItem(DISMISSED_KEY) === '1'; } catch (e) { return false; }
    }                                                                                                                       
  
    function createBanner() {                                                                                               
      if (document.getElementById('grab-sg-banner')) return;

      var banner = document.createElement('div');
      banner.id = 'grab-sg-banner';
      banner.innerHTML =
        '<div class="grab-sg-banner__icon">' +                                                                              
          '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<circle cx="11" cy="11" r="10" stroke="white" stroke-width="1.8"/>' +                                          
            '<rect x="10" y="9.5" width="2" height="6" rx="1" fill="white"/>' +
            '<rect x="10" y="6" width="2" height="2" rx="1" fill="white"/>' +                                               
          '</svg>' +                                                                                                        
        '</div>' +                                                                                                          
        '<div class="grab-sg-banner__content">' +                                                                           
          '<strong>Payments unavailable outside Singapore</strong>' +
          '<p>Feel free to look around, but checkout is only supported when you are physically in Singapore.</p>' +
        '</div>' +                                                                                                          
        '<button class="grab-sg-banner__close" aria-label="Dismiss">&times;</button>';
                                                                                                                            
      banner.querySelector('.grab-sg-banner__close').addEventListener('click', function () {                                
        banner.remove();
        try { sessionStorage.setItem(DISMISSED_KEY, '1'); } catch (e) {}                                                    
      });         

      document.body.appendChild(banner);
    }

    function maybeShow() {
      if (isDismissed()) return;

      var country = getCountry();

      if (country) {                                                                                                        
        if (country !== 'SG') createBanner();
        return;                                                                                                             
      }           

      // Country not set yet (bridge is async) — poll localStorage up to 15s                                                
      var attempts = 0;
      var interval = setInterval(function () {                                                                              
        attempts++;                                                                                                         
        var c = getCountry();
        if (c) {                                                                                                            
          clearInterval(interval);
          if (c !== 'SG' && !isDismissed()) createBanner();
          return;                                                                                                           
        }
        if (attempts >= 30) clearInterval(interval);                                                                        
      }, 500);    
    }

    if (document.readyState === 'loading') {                                                                                
      document.addEventListener('DOMContentLoaded', maybeShow);
    } else {                                                                                                                
      maybeShow();
    }
  })();
