package es.uah.pablopinas.social.infrastructure.adapter.event;

import es.uah.pablopinas.social.application.ports.out.ActivityPort;
import es.uah.pablopinas.social.domain.Activity;
import org.springframework.stereotype.Service;

@Service
public class ActivityAdapter implements ActivityPort {
    @Override
    public void notifyActivity(Activity activity) {

    }
}
