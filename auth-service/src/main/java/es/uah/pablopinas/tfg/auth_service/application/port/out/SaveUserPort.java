package es.uah.pablopinas.tfg.auth_service.application.port.out;


import es.uah.pablopinas.tfg.auth_service.domain.model.User;

public interface SaveUserPort {

    User saveUser(User user);
}
